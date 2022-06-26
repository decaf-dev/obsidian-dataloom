import React, { useContext, useState, useEffect } from "react";
import { DEBUG } from "src/app/constants";
import { useTableFocus } from "../FocusProvider";

interface IMenuContext {
	isMenuOpen?: (id: string) => boolean;
	isMenuRequestingClose?: (id: string) => boolean;
	openMenu?: (id: string, level: number) => void;
	closeMenu?: (id: string) => void;
}

const MenuContext = React.createContext<IMenuContext>(null);

export const useMenu = (id: string, level: number) => {
	const { openMenu, closeMenu, isMenuOpen, isMenuRequestingClose } =
		useContext(MenuContext);
	return {
		isMenuOpen: isMenuOpen(id),
		isMenuRequestingClose: isMenuRequestingClose(id),
		openMenu: () => openMenu(id, level),
		closeMenu: () => closeMenu(id),
	};
};

interface Props {
	children: React.ReactNode;
}

interface Menu {
	id: string;
	level: number;
	isRequestingClose: boolean;
}

export default function MenuProvider({ children }: Props) {
	const [openMenus, setOpenMenus] = useState<Menu[]>([]);
	const isFocused = useTableFocus();

	function canOpenMenu(level: number): boolean {
		if (openMenus.length === 0) return true;
		//If there is already a menu of that level open, do not allow us
		//to open another menu. We must close the current menu first.
		//This will allow us to provide Notion-like menu functionality
		if (openMenus.every((menu) => menu.level < level)) return true;
		return false;
	}

	function openMenu(id: string, level: number) {
		if (canOpenMenu(level)) {
			if (DEBUG.MENU_PROVIDER) {
				console.log(`[MenuProvider]: openMenu("${id}", ${level})`);
			}
			setOpenMenus((prevState) => [
				...prevState,
				{ id, level, isRequestingClose: false },
			]);
		}
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

	async function closeAllMenus() {
		if (DEBUG.MENU_PROVIDER) console.log("[MenuProvider]: closeAllMenus()");
		for (let i = 0; i < openMenus.length; i++) {
			const menu = openMenus[i];
			requestMenuClose(menu.id);
		}
	}

	function requestMenuClose(id: string) {
		if (DEBUG.MENU_PROVIDER)
			console.log(`[MenuProvider]: requestMenuClose(${id})`);
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

	async function closeMenu(id: string) {
		if (DEBUG.MENU_PROVIDER)
			console.log(`[MenuProvider]: closeMenu(${id})`);
		if (isMenuOpen(id)) {
			if (DEBUG.MENU_PROVIDER)
				console.log(`[MenuProvider]: closing menu ${id}`);
			setOpenMenus((prevState) =>
				prevState.filter((menu) => menu.id !== id)
			);
		}
	}

	async function handleClick(e: React.MouseEvent) {
		if (DEBUG.MENU_PROVIDER) console.log(`[MenuProvider]: handleClick`);
		if (isFocused && openMenus.length !== 0) {
			if (e.target instanceof HTMLElement) {
				let el = e.target;
				//Search until we get an id
				while (el.id === "" && el.className !== "NLT__app") {
					el = el.parentElement;
				}
				//This will close top level on outside click, closing besides any other
				//click is left up to specific menu
				const menu = findTopMenu();
				if (el.id !== menu.id) {
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
				}}
			>
				{children}
			</MenuContext.Provider>
		</div>
	);
}
