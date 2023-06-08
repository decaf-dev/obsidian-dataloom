import React from "react";
import { MenuLevel } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useMenuContext } from "./menu-context";

export const useMenu = (
	level: MenuLevel,
	options?: {
		shouldRequestOnClose?: boolean;
	}
) => {
	const { shouldRequestOnClose = false } = options || {};
	const [menu] = React.useState({
		id: "m" + uuidv4(),
		level,
		shouldRequestOnClose,
	});
	const menuRef = React.useRef<HTMLDivElement>(null);

	const {
		isMenuOpen,
		openMenu,
		closeTopMenu,
		menuCloseRequest,
		closeAllMenus,
	} = useMenuContext();

	return {
		menu,
		menuRef,
		isMenuOpen: isMenuOpen(menu),
		menuCloseRequest:
			menuCloseRequest?.id === menu.id ? menuCloseRequest : null,
		openMenu,
		closeTopMenu,
		closeAllMenus,
	};
};
