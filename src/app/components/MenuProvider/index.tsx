import React, { useContext, useState, useEffect } from "react";
import { DEBUG } from "src/app/constants";
import { useTableFocus } from "../FocusProvider";

interface IMenuContext {
	isMenuOpen?: (id: string) => boolean;
	openMenu?: (id: string, level: number) => void;
	closeMenu?: (id: string) => void;
}

const MenuContext = React.createContext<IMenuContext>(null);

export const useMenu = (id: string, level: number) => {
	const { openMenu, closeMenu, isMenuOpen } = useContext(MenuContext);

	return {
		isMenuOpen: isMenuOpen(id),
		openMenu: () => openMenu(id, level),
		closeMenu: () => closeMenu(id),
	};
};

interface Props {
	children: React.ReactNode;
}

export default function MenuProvider({ children }: Props) {
	const [openMenus, setOpenMenus] = useState([]);
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
			const menu = { id, level };
			if (DEBUG.MENU_PROVIDER.HANDLER) {
				console.log(`[MenuProvider]: openMenu("${id}", ${level})`);
			}
			setOpenMenus((prevState) => [...prevState, menu]);
		}
	}

	function isMenuOpen(id: string): boolean {
		if (openMenus.find((menu) => menu.id === id)) return true;
		return false;
	}

	function closeAllMenus() {
		if (DEBUG.MENU_PROVIDER.HANDLER) {
			console.log("[MenuProvider]: closeAllMenus()");
		}
		setOpenMenus([]);
	}

	const closeMenu = (id: string) => {
		if (isMenuOpen(id)) {
			if (DEBUG.MENU_PROVIDER.HANDLER) {
				console.log(`[MenuProvider]: closeMenu(${id})`);
			}
			setOpenMenus((prevState) =>
				prevState.filter((menu) => menu.id !== id)
			);
		}
	};

	function handleClick(e: React.MouseEvent) {
		if (DEBUG.MENU_PROVIDER.HANDLER) {
			console.log(`[MenuProvider]: handleClick`);
		}
		setTimeout(() => {
			if (isFocused && openMenus.length !== 0) {
				if (e.target instanceof HTMLElement) {
					let el = e.target;
					//Search until we get an id
					while (el.id === "" && el.className !== "NLT__app") {
						el = el.parentElement;
					}
					//This will close top level on outside click, closing besides any other
					//click is left up to specific menu
					const topMenu = findTopMenu();
					if (el.id !== topMenu.id) {
						closeMenu(topMenu.id);
					}
				}
			}
		}, 1);
	}

	function handleKeyUp(e: React.KeyboardEvent) {
		if (isFocused && openMenus.length !== 0) {
			//This will work with the last added menu
			if (e.key === "Enter") {
				const topMenu = findTopMenu();
				closeMenu(topMenu.id);
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
		if (!isFocused) closeAllMenus();
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
					closeMenu,
				}}
			>
				{children}
			</MenuContext.Provider>
		</div>
	);
}
