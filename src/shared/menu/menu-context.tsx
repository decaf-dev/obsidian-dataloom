import React from "react";
import {
	addFocusVisibleClass,
	focusMenuElement,
	removeFocusVisibleClass,
} from "./focus-visible";
import { Menu, MenuLevel } from "./types";
import { useTableState } from "../table-state/table-state-context";
import {
	isMacRedoDown,
	isMacUndoDown,
	isSpecialActionDown,
	isWindowsRedoDown,
	isWindowsUndoDown,
} from "../keyboard-event";
import { eventSystem } from "../event-system/event-system";

interface ContextProps {
	openMenus: Menu[];
	menuCloseRequestTime: number | null;
	openMenu: (menu: Menu) => void;
	closeTopMenu: (shouldFocusTriggerOnClose?: boolean) => void;
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
	const [openMenus, setOpenMenus] = React.useState<Menu[]>([]);

	/**
	 * A reference to the current table state
	 */
	const { tableId, tableState } = useTableState();

	const [menuCloseRequestTime, setMenuCloseRequestTime] = React.useState<
		number | null
	>(null);

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
		setMenuCloseRequestTime(null);
	}

	/**
	 * Closes the top level menu
	 */
	const closeTopMenu = React.useCallback(
		(shouldFocusTrigger = true) => {
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
			setMenuCloseRequestTime(null);
		},
		[openMenus]
	);

	React.useEffect(() => {
		function handleClick(e: MouseEvent) {
			const target = e.target as HTMLElement;

			if (isMenuOpen()) {
				const menu = openMenus.last();
				if (!menu) throw new Error("Menu is open but no menu exists");

				const { id } = menu;

				//If the menu is not mounted, we don't need to do anything
				//This can happen when a menu changes
				const isElementMounted = document.contains(target);
				if (!isElementMounted) return;

				if (target.closest(`.NLT__menu[data-menu-id="${id}"]`) !== null)
					return;
				if (
					target.closest(`.NLT__focusable[data-menu-id="${id}"]`) !==
					null
				)
					return;

				closeTopMenu();
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

		function handleEnterDown(e: KeyboardEvent) {
			const target = e.target as HTMLElement;

			if (isSpecialActionDown(e)) return;

			//Prevents the event key from triggering the click event
			if (target.getAttribute("data-menu-id") !== null) {
				e.preventDefault();
			}

			//If a menu is open, then close the menu
			if (isMenuOpen()) {
				const menu = openMenus.last();
				if (!menu) throw new Error("Menu is open but no menu exists");

				if (menu.shouldRequestOnClose) {
					setMenuCloseRequestTime(Date.now());
				} else {
					closeTopMenu();
				}
			} else {
				//Otherwise if we're focused on a MenuTrigger, open the menu
				openMenuFromFocusedTrigger();
				removeFocusVisibleClass();
			}
		}

		function handleEscapeDown(e: KeyboardEvent) {
			if (isMenuOpen()) closeTopMenu();
		}

		function handleTabDown(e: KeyboardEvent) {
			if (isMenuOpen()) {
				// Disallow the default event which will change focus to the next element
				e.preventDefault();
			} else {
				removeFocusVisibleClass();
			}
		}

		function handleArrowDown(e: KeyboardEvent) {
			if (!isMenuOpen()) {
				//Prevent scrolling the pane with the arrow keys
				e.preventDefault();

				//Only handle keys when the currentMenu isn't open
				let focusedEl = document.activeElement;
				if (focusedEl) {
					removeFocusVisibleClass();

					const tableEl = document.getElementById(tableId);
					if (!tableEl) throw new Error("Table element not found");

					const focusableEls =
						tableEl.querySelectorAll(".NLT__focusable");

					const index = Array.from(focusableEls).indexOf(focusedEl);
					switch (e.key) {
						case "ArrowUp": {
							//Normal number of columns in a row
							//Num columns + drag menu cell
							const numColumns =
								tableState.model.columns.length + 1;
							//The function row doesn't have a drag menu cell
							const numColumnsFunctionRow = numColumns - 1;

							//Handle very last row
							if (index === focusableEls.length - 1) {
								focusedEl =
									focusableEls[index - numColumnsFunctionRow];
							} else if (index - numColumns >= 0) {
								focusedEl = focusableEls[index - numColumns];
								//Handle the last row
							}
							break;
						}
						case "ArrowLeft":
							if (index - 1 >= 0)
								focusedEl = focusableEls[index - 1];
							break;
						case "ArrowRight":
							if (index + 1 < focusableEls.length)
								focusedEl = focusableEls[index + 1];
							break;
						case "ArrowDown":
							{
								//This is the "New Row" button
								const rowIndexEnd = focusableEls.length - 1;

								//Normal number of columns in a row
								//Num columns + drag menu cell
								const numColumns =
									tableState.model.columns.length + 1;
								//The last row doesn't have a drag menu cell
								const numColumnsFunctionRow = numColumns - 1;
								//Handle until the last 2 rows
								if (index + numColumns <= rowIndexEnd - 1) {
									focusedEl =
										focusableEls[index + numColumns];
									//Handle the function row
								} else if (
									index >=
										rowIndexEnd - numColumnsFunctionRow &&
									index <= rowIndexEnd
								) {
									focusedEl = focusableEls[rowIndexEnd];
								}
							}
							break;
					}
					(focusedEl as HTMLElement).focus();
				}
			}
		}

		function handleKeyDown(e: KeyboardEvent) {
			switch (e.code) {
				case "Enter":
					handleEnterDown(e);
					break;
				case "Escape":
					handleEscapeDown(e);
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

		eventSystem.addEventListener("click", handleClick);
		eventSystem.addEventListener("keydown", handleKeyDown);
		return () => {
			eventSystem.removeEventListener("click", handleClick);
			eventSystem.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		isMenuOpen,
		closeTopMenu,
		openMenu,
		openMenus,
		tableId,
		tableState.model.columns.length,
	]);

	return (
		<MenuContext.Provider
			value={{
				openMenus,
				openMenu,
				menuCloseRequestTime,
				closeTopMenu,
				closeAllMenus,
			}}
		>
			{children}
		</MenuContext.Provider>
	);
}
