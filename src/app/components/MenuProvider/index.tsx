import NltPlugin from "main";
import React, { useContext, useState, useCallback, useEffect } from "react";
import { useTableFocus } from "../FocusProvider";

interface IMenuContext {
	isMenuOpen?: (id: string) => boolean;
	openMenu?: (id: string, level: number) => void;
	closeMenu?: (id: string) => void;
}

const MenuContext = React.createContext<IMenuContext>({});

export const useMenu = () => {
	return useContext(MenuContext);
};

interface Props {
	children: React.ReactNode;
}

export default function MenuProvider({ children }: Props) {
	const [openMenus, setOpenMenus] = useState([]);
	const isFocused = useTableFocus();

	function openMenu(id: string, level: number) {
		const menu = { id, level };
		setOpenMenus((prevState) => [...prevState, menu]);
	}

	function isMenuOpen(id: string): boolean {
		return openMenus.find((menu) => menu.id === id);
	}

	function closeAllMenus() {
		setOpenMenus([]);
	}

	const closeMenu = (id: string) => {
		console.log("CLOSING MENU", id);
		console.log(openMenus);
		setOpenMenus((prevState) => prevState.filter((menu) => menu.id !== id));
	};

	function handleClick(e: React.MouseEvent) {
		if (isFocused && openMenus.length !== 0) {
			if (e.target instanceof HTMLElement) {
				let el = e.target;
				//Search until we get an id
				while (el.id === "" && el.className !== "NLT__app") {
					el = el.parentElement;
				}
				//Close top level
				const topMenu = findTopMenu();
				if (el.id !== topMenu.id) closeMenu(topMenu.id);
			}
		}
	}

	function handleKeyUp(e: React.KeyboardEvent) {
		if (isFocused && openMenus.length !== 0) {
			//This will work with the last added menu
			if (e.key === "Enter") {
				const topMenu = findTopMenu();
				closeMenu(topMenu.id);
			}
		}
		// if (e.key === "Tab") onTabPress();
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
		<div onKeyUp={handleKeyUp} onMouseDown={handleClick}>
			<MenuContext.Provider value={{ isMenuOpen, openMenu, closeMenu }}>
				{children}
			</MenuContext.Provider>
		</div>
	);
}
