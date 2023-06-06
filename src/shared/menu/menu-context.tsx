import React from "react";
import {
	addFocusVisibleClass,
	focusMenuElement,
	removeFocusVisibleClass,
} from "./focus-visible";
import {
	MenuCloseRequest,
	MenuCloseRequestType,
	Menu,
	MenuLevel,
} from "./types";
import { useTableState } from "../table-state/table-state-context";
import {
	isMacRedoDown,
	isMacUndoDown,
	isSpecialActionDown,
	isWindowsRedoDown,
	isWindowsUndoDown,
} from "../keyboard-event";
import { eventSystem } from "../event-system/event-system";
import {
	moveFocusDown,
	moveFocusLeft,
	moveFocusRight,
	moveFocusUp,
} from "./arrow-move-focus";
import { SortDir } from "../types/types";
import { useMountContext } from "../view-context";
import { isTextSelected } from "./utils";

interface CloseOptions {
	shouldFocusTrigger?: boolean;
	forceClose?: boolean;
}

interface ContextProps {
	openMenus: Menu[];
	menuCloseRequest: MenuCloseRequest | null;
	openMenu: (menu: Menu) => void;
	closeTopMenu: (options?: CloseOptions) => void;
	closeAllMenus: (shouldFocusTriggerOnClose?: boolean) => void;
}

const MenuContext = React.createContext<ContextProps | null>(null);

export const useMenuContext = () => {
	const value = React.useContext(MenuContext);
	if (value === null) {
		throw new Error(
			"useMenu() called without a <MenuProvider /> in the tree."
		);
	}

	return value;
};

interface Props {
	children: React.ReactNode;
}

export default function MenuProvider({ children }: Props) {
	const { tableState } = useTableState();
	const { appId } = useMountContext();

	/**
	 * The menus that are currently open
	 */
	const [openMenus, setOpenMenus] = React.useState<Menu[]>([]);

	const [menuCloseRequest, setMenuCloseRequest] =
		React.useState<MenuCloseRequest | null>(null);

	/**
	 * Whether or not text is currently highlighted
	 */
	const isTextHighlighted = React.useRef(false);

	/**
	 * Returns whether or not a menu is open
	 */
	const isMenuOpen = React.useCallback(() => {
		return openMenus.length !== 0;
	}, [openMenus]);

	/**
	 * Opens a menu.
	 * There must be 0 open menus or the menu must be a higher level than the current one for the menu to be opened
	 * @param menu The menu to open
	 */
	const openMenu = React.useCallback(
		(menu: Menu) => {
			//A user can open a menu when no other menu is open or if the menu is a higher level
			//than the current one
			const canOpen =
				openMenus.find((m) => m.level < menu.level) ||
				openMenus.length === 0;

			if (!canOpen) return;

			setOpenMenus((prev) => [...prev, menu]);

			//When we close a menu, we add the focus class to the parent element.
			//If we then click on another menu, we will remove the focus class. Without this,
			//we will have 2 parent elements that are focused
			removeFocusVisibleClass();
		},
		[openMenus]
	);

	/**
	 * Closes all menus
	 * @param shouldFocusTrigger should focus the menu trigger when on close
	 */
	function closeAllMenus(shouldFocusTrigger = true) {
		const menu = openMenus.first();
		if (!menu) return;

		if (shouldFocusTrigger) {
			const { id, level } = menu;
			//If the menu level is one, we want to focus the trigger on close
			if (level === MenuLevel.ONE) {
				focusMenuElement(id);
				addFocusVisibleClass(id);
			}
		}

		setOpenMenus([]);
		setMenuCloseRequest(null);
		isTextHighlighted.current = false;
	}

	/**
	 * Closes the top level menu
	 * @param options Options for closing the menu
	 */
	const closeTopMenu = React.useCallback(
		(options?: CloseOptions) => {
			const { shouldFocusTrigger = true } = options || {};
			const menu = openMenus.last();
			if (!menu) return;

			if (shouldFocusTrigger) {
				const { id, level } = menu;
				if (level === MenuLevel.ONE) {
					focusMenuElement(id);
					addFocusVisibleClass(id);
				}
			}

			//Remove the menu
			setOpenMenus((prev) => prev.slice(0, prev.length - 1));
			setMenuCloseRequest(null);
			isTextHighlighted.current = false;
		},
		[openMenus]
	);

	/**
	 * Requests to close the top level menu
	 * @param type The type of close request
	 */
	const requestCloseTopMenu = React.useCallback(
		(type: MenuCloseRequestType) => {
			const menu = openMenus.last();
			if (!menu) return;

			if (menu.shouldRequestOnClose) {
				setMenuCloseRequest({
					id: menu.id,
					requestTime: Date.now(),
					type,
				});
				return;
			}

			closeTopMenu();
		},
		[openMenus, closeTopMenu]
	);

	React.useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (isMenuOpen()) {
				const menu = openMenus.last();
				if (!menu) throw new Error("Menu is open but no menu exists");

				const { id } = menu;
				const target = e.target as HTMLElement;
				//If the menu is not mounted, we don't need to do anything
				//This can happen when a menu changes
				const isElementMounted = document.contains(target);
				if (!isElementMounted) return;

				//If we're clicking on the menu then don't close
				if (target.closest(`.NLT__menu[data-id="${id}"]`)) return;

				//The event will propagate from the menu trigger to the document
				//If we don't have this check, then we will close the menu when we click on the trigger
				if (target.closest(`.NLT__focusable[data-menu-id="${id}"]`))
					return;

				//If we're highlighting text then don't close the menu
				if (isTextHighlighted.current) return;

				requestCloseTopMenu("click");
			} else {
				removeFocusVisibleClass();
			}
		}

		function openMenuFromFocusedTrigger() {
			const focusedEl = document.activeElement as HTMLElement;
			if (focusedEl) {
				if (focusedEl.className.includes("NLT__focusable")) {
					const menuId = focusedEl.getAttribute("data-menu-id");
					const shouldRequestOnClose = focusedEl.getAttribute(
						"data-menu-should-request-on-close"
					);

					//If this is a MenuTrigger element, then open the menu
					if (menuId && shouldRequestOnClose)
						openMenu({
							id: menuId,
							level: MenuLevel.ONE,
							shouldRequestOnClose:
								shouldRequestOnClose === "true",
						});
				}
			}
		}

		function handleMouseDown() {
			isTextHighlighted.current = false;
		}

		function handleSelectionChange() {
			isTextHighlighted.current = isTextSelected();
		}

		function handleEnterDown(e: KeyboardEvent) {
			const target = e.target as HTMLElement;

			//TODO fix
			if (isSpecialActionDown(e)) return;

			//Prevents the event key from triggering the click event
			if (target.getAttribute("data-menu-id")) e.preventDefault();

			//If a menu is open, then close the menu
			if (isMenuOpen()) {
				const menu = openMenus.last();
				if (!menu) throw new Error("Menu is open but no menu exists");

				//If we're highlighting text then don't close the menu
				if (isTextHighlighted.current) return;

				requestCloseTopMenu("enter");
			} else {
				//Otherwise if we're focused on a MenuTrigger, open the menu
				openMenuFromFocusedTrigger();
				removeFocusVisibleClass();
			}
		}

		function handleEscapeDown() {
			if (isMenuOpen()) closeTopMenu();
		}

		function handleTabDown(e: KeyboardEvent) {
			if (isMenuOpen()) {
				// Disallow the default event which will change focus to the next element
				e.preventDefault();
				return;
			}
			removeFocusVisibleClass();
		}

		function handleArrowDown(e: KeyboardEvent) {
			if (isMenuOpen()) return;

			//Only handle keys when the currentMenu isn't open
			const focusedEl = document.activeElement;
			if (!focusedEl) return;

			const tableEl = focusedEl.closest(`.NLT__app[data-id="${appId}"]`);
			if (!tableEl) throw new Error("Table el not found");

			const focusableEls = tableEl.querySelectorAll(".NLT__focusable");
			const index = Array.from(focusableEls).indexOf(focusedEl);
			if (index === -1) return;

			removeFocusVisibleClass();

			const numVisibleColumns = tableState.model.columns.filter(
				(column) => column.isVisible
			).length;
			const numBodyRows = tableState.model.bodyRows.length;
			const numSortedColumns = tableState.model.columns.filter(
				(column) => column.sortDir !== SortDir.NONE
			).length;

			let elementToFocus: Element | null = null;
			switch (e.key) {
				case "ArrowUp":
					elementToFocus = moveFocusUp(
						focusableEls,
						numVisibleColumns,
						numBodyRows,
						numSortedColumns,
						index
					);
					break;
				case "ArrowLeft":
					elementToFocus = moveFocusLeft(focusableEls, index);
					break;
				case "ArrowRight":
					elementToFocus = moveFocusRight(focusableEls, index);
					break;
				case "ArrowDown":
					elementToFocus = moveFocusDown(
						focusableEls,
						numVisibleColumns,
						numBodyRows,
						numSortedColumns,
						index
					);
					break;
			}
			if (elementToFocus !== null)
				(elementToFocus as HTMLElement).focus();
		}

		function handleKeyDown(e: KeyboardEvent) {
			switch (e.code) {
				case "Enter":
					handleEnterDown(e);
					break;
				case "Escape":
					handleEscapeDown();
					break;
				case "Tab":
					handleTabDown(e);
					break;
				case "ArrowLeft":
				case "ArrowRight":
				case "ArrowUp":
				case "ArrowDown":
					handleArrowDown(e);
					break;
				default:
					if (
						isMacUndoDown(e) ||
						isMacRedoDown(e) ||
						isWindowsUndoDown(e) ||
						isWindowsRedoDown(e)
					)
						return;

					if (e.key.length !== 1) return;
					openMenuFromFocusedTrigger();
					break;
			}
		}

		//We add a priority of 2, because we want the menu trigger to always
		//run first
		eventSystem.addEventListener("click", handleClick, 2);
		eventSystem.addEventListener("keydown", handleKeyDown);
		eventSystem.addEventListener("mousedown", handleMouseDown);
		eventSystem.addEventListener("selectionchange", handleSelectionChange);
		return () => {
			eventSystem.removeEventListener("click", handleClick);
			eventSystem.removeEventListener("keydown", handleKeyDown);
			eventSystem.removeEventListener("mousedown", handleMouseDown);
			eventSystem.removeEventListener("mouseup", handleSelectionChange);
		};
	}, [
		isMenuOpen,
		closeTopMenu,
		openMenu,
		requestCloseTopMenu,
		openMenus,
		appId,
		tableState,
	]);

	return (
		<MenuContext.Provider
			value={{
				openMenus,
				openMenu,
				menuCloseRequest,
				closeTopMenu,
				closeAllMenus,
			}}
		>
			{children}
		</MenuContext.Provider>
	);
}
