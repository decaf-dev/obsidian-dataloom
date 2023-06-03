import React from "react";
import { Menu, MenuLevel } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useMenuContext } from "./menu-context";

export const useMenu = (
	level: MenuLevel,
	options?: {
		shouldRequestOnClose?: boolean;
	}
) => {
	const { shouldRequestOnClose = false } = options || {};
	const [id] = React.useState("m" + uuidv4());
	const menuRef = React.useRef<HTMLDivElement>(null);

	const {
		openMenus,
		openMenu,
		closeTopMenu,
		menuCloseRequestTime,
		forceCloseAllMenus,
	} = useMenuContext();
	const isOpen = openMenus.find((menu) => menu.id === id) ? true : false;

	const menu: Menu = React.useMemo(() => {
		return { id, level, shouldRequestOnClose };
	}, [id, level, shouldRequestOnClose]);

	return {
		menu,
		menuRef,
		isMenuOpen: isOpen,
		menuCloseRequestTime,
		openMenu,
		closeTopMenu,
		forceCloseAllMenus,
	};
};
