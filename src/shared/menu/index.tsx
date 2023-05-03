import React from "react";
import { addFocusVisibleClass, removeFocusVisibleClass } from "./focus-visible";
import { Menu, MenuLevel } from "./types";

interface ContextProps {
	openMenus: Menu[];
	openMenu: (menu: Menu) => void;
	closeTopLevelMenu: () => void;
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
	const [openMenus, setOpenMenus] = React.useState<Menu[]>([]);

	const isMenuOpen = React.useCallback(() => {
		return openMenus.length !== 0;
	}, [openMenus]);

	const topLevelMenu = React.useCallback(() => {
		return openMenus.last();
	}, [openMenus]);

	const openMenu = React.useCallback(
		(menu: Menu) => {
			//Only open a new menu is no current menu is open
			//or if the new menu is a higher level than the previous
			const canOpen =
				openMenus.find((m) => m.level < menu.level) ||
				openMenus.length === 0;
			if (!canOpen) return;

			setOpenMenus((prev) => [...prev, menu]);
			//Remove any focus. This is necessary when we close a menu,
			//and the menu has focus and then we click on another menu
			//and then close it. Without this, we will have 2 items with the class
			removeFocusVisibleClass();
		},
		[openMenus]
	);

	function closeTopLevelMenu() {
		setOpenMenus((prev) => prev.slice(0, prev.length - 1));
	}

	React.useEffect(() => {
		function handleMouseUp(e: MouseEvent) {
			const target = e.target as HTMLElement;
			if (isMenuOpen()) {
				const menu = topLevelMenu();
				if (!menu) throw new Error("Menu is open but no menu exists");

				const { id, level } = menu;
				//If we didn't click on the current menu then close the menu
				//and focus the parent
				if (!target.closest(`.NLT__focusable[data-menu-id="${id}"]`)) {
					if (level === MenuLevel.ONE) addFocusVisibleClass(id);
					closeTopLevelMenu();
				}
			} else {
				removeFocusVisibleClass();
			}
		}

		function openMenuFromFocusedEl() {
			const focusedEl = document.activeElement as HTMLElement;
			if (focusedEl) {
				if (focusedEl.className.includes("focusable")) {
					const id = focusedEl.getAttribute("data-menu-id");
					if (id)
						setOpenMenus([
							{
								id,
								level: MenuLevel.ONE,
								shouldRequestOnClose: false,
							},
						]);
				}
			}
		}

		function handleEnterDown() {
			//If a menu is open, then close the menu
			if (isMenuOpen()) {
				const menu = topLevelMenu();
				if (!menu) throw new Error("Menu is open but no menu exists");

				addFocusVisibleClass(menu.id);
				closeTopLevelMenu();
			} else {
				//Otherwise if we're focused on a focusable cell,
				//open the menu if the data-id exists
				openMenuFromFocusedEl();
				removeFocusVisibleClass();
			}
		}

		function handleTabDown(e: KeyboardEvent) {
			if (isMenuOpen()) {
				// Disallow the default event which will change focus
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

					const tabbableEls =
						document.querySelectorAll(".NLT__focusable");

					const index = Array.from(tabbableEls).indexOf(focusedEl);
					switch (e.key) {
						case "ArrowUp":
							if (index - 4 >= 0)
								focusedEl = tabbableEls[index - 4];
							break;
						case "ArrowLeft":
							if (index - 1 >= 0)
								focusedEl = tabbableEls[index - 1];
							break;
						case "ArrowRight":
							if (index + 1 < tabbableEls.length)
								focusedEl = tabbableEls[index + 1];
							break;
						case "ArrowDown":
							if (index + 4 < tabbableEls.length)
								focusedEl = tabbableEls[index + 4];
							break;
					}
					(focusedEl as HTMLElement).focus();
				}
			}
		}

		function handleKeyDown(e: KeyboardEvent) {
			switch (e.code) {
				case "Enter":
					handleEnterDown();
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
					if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey)
						return;
					openMenuFromFocusedEl();
					break;
			}
		}
		window.addEventListener("mouseup", handleMouseUp);
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isMenuOpen, openMenu]);

	return (
		<MenuContext.Provider
			value={{ openMenus, openMenu, closeTopLevelMenu }}
		>
			{children}
		</MenuContext.Provider>
	);
}
