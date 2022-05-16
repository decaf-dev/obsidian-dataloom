import React, { useContext, useState } from "react";

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

	function closeMenu(id: string) {
		setOpenMenus((prevState) => prevState.filter((menu) => menu.id !== id));
	}

	return (
		<MenuContext.Provider value={{ openMenus, openMenu, closeMenu }}>
			{children}
		</MenuContext.Provider>
	);
}
