import React, { useContext, useState, useEffect } from "react";
import { DEBUG, MENU_LEVEL } from "src/constants";
import NltPlugin from "src/main";
import { logFunc } from "src/services/debug";
import { useTableFocus } from "../FocusProvider";

interface IMenuContext {
	closeAllMenus?: () => void;
	isAnyMenuOpen?: () => boolean;
	isMenuOpen?: (id: string) => boolean;
	isMenuRequestingClose?: (id: string) => boolean;
	openMenu?: (id: string, level: number) => void;
	closeMenu?: (id: string) => void;
}

const MenuContext = React.createContext<IMenuContext>(null);

const COMPONENT_NAME = "MenuProvider";

export const useMenu = () => {
	const { isAnyMenuOpen, closeAllMenus } = useContext(MenuContext);
	return {
		isAnyMenuOpen,
		closeAllMenus,
	};
};

export const useMenuId = (id: string, level: number = MENU_LEVEL.ONE) => {
	const { openMenu, closeMenu, isMenuOpen, isMenuRequestingClose } =
		useContext(MenuContext);
	return {
		isMenuOpen: isMenuOpen(id),
		isMenuRequestingClose: isMenuRequestingClose(id),
		openMenu: () => openMenu(id, level),
		closeMenu: () => closeMenu(id),
	};
};

interface Menu {
	id: string;
	level: number;
	isRequestingClose: boolean;
}

interface Props {
	plugin: NltPlugin;
	children: React.ReactNode;
}

export default function MenuProvider({ plugin, children }: Props) {
	const [openMenus, setOpenMenus] = useState<Menu[]>([]);
	const isFocused = useTableFocus();

	function isAnyMenuOpen(): boolean {
		return openMenus.length !== 0;
	}

	// TODO change
	// This was causing a lot of issues
	// function canOpenMenu(level: number): boolean {
	// 	if (openMenus.length === 0) return true;
	// 	//If there is already a menu of that level open, do not allow us
	// 	//to open another menu. We must close the current menu first.
	// 	//This will allow us to provide Notion-like menu functionality
	// 	if (openMenus.every((menu) => menu.level < level)) return true;
	// 	return false;
	// }

	function openMenu(id: string, level: number) {
		if (DEBUG.MENU_PROVIDER)
			logFunc(COMPONENT_NAME, "openMenu", { id, level });
		setOpenMenus(() => [{ id, level, isRequestingClose: false }]);
	}

	function isMenuRequestingClose(id: string) {
		const menu = openMenus.find((menu) => menu.id === id);
		if (menu) {
			if (menu.isRequestingClose) {
				return true;
			}
		}
		return false;
	}

	function isMenuOpen(id: string): boolean {
		if (openMenus.find((menu) => menu.id === id)) return true;
		return false;
	}

	async function forceCloseAllMenus() {
		if (DEBUG.MENU_PROVIDER) logFunc(COMPONENT_NAME, "forceCloseAllMenus");
		for (let i = 0; i < openMenus.length; i++) {
			const menu = openMenus[i];
			closeMenu(menu.id);
		}
	}

	async function closeAllMenus() {
		if (DEBUG.MENU_PROVIDER) logFunc(COMPONENT_NAME, "closeAllMenus");
		for (let i = 0; i < openMenus.length; i++) {
			const menu = openMenus[i];
			requestMenuClose(menu.id);
		}
	}

	function requestMenuClose(id: string) {
		if (DEBUG.MENU_PROVIDER)
			logFunc(COMPONENT_NAME, "requestMenuClose", { id });
		setOpenMenus((prevState) => {
			return prevState.map((menu) => {
				if (menu.id === id) {
					return {
						...menu,
						isRequestingClose: true,
					};
				}
				return menu;
			});
		});
	}

	function closeMenu(id: string) {
		if (DEBUG.MENU_PROVIDER) logFunc(COMPONENT_NAME, "closeMenu", { id });
		if (isMenuOpen(id)) {
			setOpenMenus((prevState) =>
				prevState.filter((menu) => menu.id !== id)
			);
		}
	}

	async function handleClick(e: React.MouseEvent) {
		if (DEBUG.MENU_PROVIDER) logFunc(COMPONENT_NAME, "handleClick");
		if (isFocused && openMenus.length !== 0) {
			if (e.target instanceof HTMLElement) {
				let el = e.target;
				//Search until we get an id
				while (el.id === "" && el.className !== "NLT__app") {
					el = el.parentElement;
					console.log("Element stack", el);
				}
				//This will close top level on outside click, closing besides any other
				//click is left up to specific menu
				const menu = findTopMenu();
				if (el.id !== menu.id) {
					console.log("Element", el);
					console.log("Menu id", menu.id);
					await requestMenuClose(menu.id);
				}
			}
		}
	}

	async function handleKeyUp(e: React.KeyboardEvent) {
		if (isFocused && openMenus.length !== 0) {
			//This will work with the last added menu
			if (e.key === "Enter") {
				const menu = findTopMenu();
				await requestMenuClose(menu.id);
			}
		}
	}

	function findTopMenu() {
		//Find highest level
		let topMenu = openMenus[0];
		openMenus.forEach((menu) => {
			if (menu.level > topMenu.level) topMenu = menu;
		});
		return topMenu;
	}

	useEffect(() => {
		if (DEBUG.MENU_PROVIDER)
			logFunc(COMPONENT_NAME, "useEffect", { isFocused });
		async function handleBlur() {
			await closeAllMenus();
		}
		if (!isFocused) handleBlur();
	}, [isFocused]);

	return (
		<div
			onMouseDown={(e) => e.preventDefault()}
			onClick={handleClick}
			onKeyUp={handleKeyUp}
		>
			<MenuContext.Provider
				value={{
					isMenuOpen,
					openMenu,
					isMenuRequestingClose,
					closeMenu,
					isAnyMenuOpen,
					closeAllMenus,
				}}
			>
				{children}
			</MenuContext.Provider>
		</div>
	);
}
