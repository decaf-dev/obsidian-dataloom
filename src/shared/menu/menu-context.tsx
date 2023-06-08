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

interface CloseOptions {
	shouldFocusTrigger?: boolean;
	forceClose?: boolean;
}

interface ContextProps {
	topMenu: Menu | null;
	menuCloseRequest: MenuCloseRequest | null;
	openMenu: (menu: Menu) => void;
	hasOpenMenu: () => boolean;
	canOpenMenu: (menu: Menu) => boolean;
	isMenuOpen: (menu: Menu) => boolean;
	closeTopMenu: (options?: CloseOptions) => void;
	requestCloseTopMenu: (type: MenuCloseRequestType) => void;
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
	/**
	 * The menus that are currently open
	 */
	const [currentMenus, setCurrentMenus] = React.useState<Menu[]>([]);

	const [menuCloseRequest, setMenuCloseRequest] =
		React.useState<MenuCloseRequest | null>(null);

	/**
	 * Whether or not text is currently highlighted
	 */
	const isTextHighlighted = React.useRef(false);

	/**
	 * Returns whether or not a menu is open
	 */
	const isMenuOpen = React.useCallback(
		(menu: Menu) => {
			return currentMenus.find((m) => m.id === menu.id) !== undefined;
		},
		[currentMenus]
	);

	/**
	 * Returns whether or not a menu is open
	 */
	const hasOpenMenu = React.useCallback(() => {
		return currentMenus.length !== 0;
	}, [currentMenus]);

	const canOpenMenu = React.useCallback(
		(menu: Menu) => {
			//A user can open a menu when no other menu is open or if the menu is a higher level
			//than the current one
			return (
				currentMenus.find((m) => m.level === menu.level) ===
					undefined || currentMenus.length === 0
			);
		},
		[currentMenus]
	);

	/**
	 * Opens a menu.
	 * There must be 0 open menus or the menu must be a higher level than the current one for the menu to be opened
	 * @param menu The menu to open
	 */
	const openMenu = React.useCallback(
		(menu: Menu) => {
			if (!canOpenMenu(menu)) return;

			setCurrentMenus((prev) => [...prev, menu]);

			//When we close a menu, we add the focus class to the parent element.
			//If we then click on another menu, we will remove the focus class. Without this,
			//we will have 2 parent elements that are focused
			removeFocusVisibleClass();
		},
		[canOpenMenu]
	);

	/**
	 * Closes all menus
	 * @param shouldFocusTrigger should focus the menu trigger when on close
	 */
	function closeAllMenus(shouldFocusTrigger = true) {
		const menu = currentMenus.first();
		if (!menu) return;

		if (shouldFocusTrigger) {
			const { id, level } = menu;
			//If the menu level is one, we want to focus the trigger on close
			if (level === MenuLevel.ONE) {
				focusMenuElement(id);
				addFocusVisibleClass(id);
			}
		}

		setCurrentMenus([]);
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
			const menu = currentMenus.last();
			if (!menu) return;

			if (shouldFocusTrigger) {
				const { id, level } = menu;
				if (level === MenuLevel.ONE) {
					focusMenuElement(id);
					addFocusVisibleClass(id);
				}
			}

			//Remove the menu
			setCurrentMenus((prev) => prev.slice(0, prev.length - 1));
			setMenuCloseRequest(null);
			isTextHighlighted.current = false;
		},
		[currentMenus]
	);

	/**
	 * Requests to close the top level menu
	 * @param type The type of close request
	 */
	const requestCloseTopMenu = React.useCallback(
		(type: MenuCloseRequestType) => {
			const menu = currentMenus.last();
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
		[currentMenus, closeTopMenu]
	);

	// function handleArrowDown(e: KeyboardEvent) {
	// 	if (hasOpenMenu()) return;

	// 	//Only handle keys when the currentMenu isn't open
	// 	const focusedEl = document.activeElement;
	// 	if (!focusedEl) return;

	// 	const tableEl = focusedEl.closest(`.NLT__app[data-id="${appId}"]`);
	// 	if (!tableEl) throw new Error("Table el not found");

	// 	const focusableEls = tableEl.querySelectorAll(".NLT__focusable");
	// 	const index = Array.from(focusableEls).indexOf(focusedEl);
	// 	if (index === -1) return;

	// 	removeFocusVisibleClass();

	// 	const numVisibleColumns = tableState.model.columns.filter(
	// 		(column) => column.isVisible
	// 	).length;
	// 	const numBodyRows = tableState.model.bodyRows.length;
	// 	const numSortedColumns = tableState.model.columns.filter(
	// 		(column) => column.sortDir !== SortDir.NONE
	// 	).length;

	// 	let elementToFocus: Element | null = null;
	// 	switch (e.key) {
	// 		case "ArrowUp":
	// 			elementToFocus = moveFocusUp(
	// 				focusableEls,
	// 				numVisibleColumns,
	// 				numBodyRows,
	// 				numSortedColumns,
	// 				index
	// 			);
	// 			break;
	// 		case "ArrowLeft":
	// 			elementToFocus = moveFocusLeft(focusableEls, index);
	// 			break;
	// 		case "ArrowRight":
	// 			elementToFocus = moveFocusRight(focusableEls, index);
	// 			break;
	// 		case "ArrowDown":
	// 			elementToFocus = moveFocusDown(
	// 				focusableEls,
	// 				numVisibleColumns,
	// 				numBodyRows,
	// 				numSortedColumns,
	// 				index
	// 			);
	// 			break;
	// 	}
	// 	if (elementToFocus !== null)
	// 		(elementToFocus as HTMLElement).focus();
	// }

	// function handleKeyDown(e: KeyboardEvent) {
	// 	switch (e.code) {
	// 		case "ArrowLeft":
	// 		case "ArrowRight":
	// 		case "ArrowUp":
	// 		case "ArrowDown":
	// 			handleArrowDown(e);
	// 			break;
	// 	}
	// }

	return (
		<MenuContext.Provider
			value={{
				topMenu: currentMenus.last() ?? null,
				hasOpenMenu,
				isMenuOpen,
				openMenu,
				canOpenMenu,
				menuCloseRequest,
				requestCloseTopMenu,
				closeTopMenu,
				closeAllMenus,
			}}
		>
			{children}
		</MenuContext.Provider>
	);
}
