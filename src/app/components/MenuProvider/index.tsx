import React, { useContext, useState, useEffect, useCallback } from "react";

const MenuContext = React.createContext({});

export const useMenu = () => {
	return useContext(MenuContext);
};

interface Props {
	children: React.ReactNode;
}

export default function MenuProvider({ children }: Props) {
	const [openMenus, setOpenMenus] = useState([]);

	function openMenu(id: string, level: number) {
		const menu = { id, level };
		setOpenMenus((prevState) => [...prevState, menu]);
	}

	function isMenuOpen(id: string): boolean {
		return openMenus.find((menu) => menu.id === id);
	}

	const closeMenu = useCallback((id: string) => {
		setOpenMenus((prevState) => prevState.filter((menu) => menu.id !== id));
	}, []);

	useEffect(() => {
		function findTopMenu() {
			//Find highest level
			let topMenu = openMenus[0];
			openMenus.forEach((menu) => {
				if (menu.level > topMenu.level) topMenu = menu;
			});
			return topMenu;
		}

		function handleClick(e: MouseEvent) {
			if (e.target instanceof HTMLElement) {
				let el = e.target;
				//Search until we get an id
				while (el.id === "" && el.className !== "NLT__app") {
					el = el.parentElement;
				}

				if (openMenus.length !== 0) {
					//Close top level
					const topMenu = findTopMenu();
					if (el.id !== topMenu.id) closeMenu(topMenu.id);
				}
			}
		}

		function handleKeyUp(e: KeyboardEvent) {
			//This will work with the last added menu
			if (e.key === "Enter") {
				if (openMenus.length !== 0) {
					const topMenu = findTopMenu();
					closeMenu(topMenu.id);
				}
			}
			// if (e.key === "Tab") onTabPress();
		}

		document.addEventListener("mousedown", handleClick);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [openMenus.length, closeMenu]);

	return (
		<MenuContext.Provider value={{ isMenuOpen, openMenu, closeMenu }}>
			{children}
		</MenuContext.Provider>
	);
}
