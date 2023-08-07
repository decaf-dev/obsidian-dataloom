import React from "react";
import {
	focusMenuElement,
	removeFocusVisibleClass,
} from "../../../shared/menu/focus-visible";
import {
	MenuCloseRequest,
	MenuCloseRequestType,
	LoomMenu,
} from "../../../shared/menu/types";
import { useLogger } from "../../../shared/logger";

interface CloseOptions {
	shouldFocusTrigger?: boolean;
	forceClose?: boolean;
}

interface ContextProps {
	topMenu: LoomMenu | null;
	menuCloseRequest: MenuCloseRequest | null;
	openMenu: (menu: LoomMenu) => void;
	replaceMenu: (menu: LoomMenu) => void;
	hasOpenMenu: () => boolean;
	canOpenMenu: (menu: LoomMenu) => boolean;
	isMenuOpen: (menu: LoomMenu) => boolean;
	closeTopMenu: (options?: CloseOptions) => void;
	requestCloseTopMenu: (type: MenuCloseRequestType) => void;
	closeAllMenus: (shouldFocusTriggerOnClose?: boolean) => void;
}

const MenuContext = React.createContext<ContextProps | null>(null);

export const useMenuState = () => {
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
	const [currentMenus, setCurrentMenus] = React.useState<LoomMenu[]>([]);

	const logger = useLogger();

	const [menuCloseRequest, setMenuCloseRequest] =
		React.useState<MenuCloseRequest | null>(null);

	/**
	 * Returns whether or not a menu is open
	 */
	const isMenuOpen = React.useCallback(
		(menu: LoomMenu) => {
			return currentMenus.find((m) => m.id === menu.id) !== undefined;
		},
		[currentMenus]
	);

	/**
	 * Returns whether or not a menu is open
	 */
	const hasOpenMenu = React.useCallback(() => {
		return currentMenus.length !== 0;
	}, [currentMenus]);

	const getTopMenu = React.useCallback(() => {
		if (currentMenus.length === 0) return null;
		return currentMenus[currentMenus.length - 1];
	}, [currentMenus]);

	const canOpenMenu = React.useCallback(
		(menu: LoomMenu) => {
			//A user can open a menu when no other menu is open or if the menu is a higher level
			//than the current one
			return (
				currentMenus.find((m) => m.level === menu.level) ===
					undefined || currentMenus.length === 0
			);
		},
		[currentMenus]
	);

	/**
	 * Opens a menu.
	 * There must be 0 open menus or the menu must be a higher level than the current one for the menu to be opened
	 * @param menu The menu to open
	 */
	const openMenu = React.useCallback(
		(menu: LoomMenu) => {
			if (!canOpenMenu(menu)) return;

			setCurrentMenus((prev) => [...prev, menu]);

			//When we close a menu, we add the focus class to the parent element.
			//If we then click on another menu, we will remove the focus class. Without this,
			//we will have 2 parent elements that are focused
			removeFocusVisibleClass();
		},
		[canOpenMenu]
	);

	const replaceMenu = React.useCallback((menu: LoomMenu) => {
		setCurrentMenus([menu]);
		removeFocusVisibleClass();
	}, []);

	/**
	 * Closes all menus
	 * @param shouldFocusTrigger should focus the menu trigger when on close
	 */
	function closeAllMenus(shouldFocusTrigger = true) {
		logger("MenuProvider closeAllMenus");
		if (currentMenus.length === 0) return;
		const menu = currentMenus[0];

		if (shouldFocusTrigger) {
			const { id } = menu;
			focusMenuElement(id);
		}

		setCurrentMenus([]);
		setMenuCloseRequest(null);
	}

	/**
	 * Closes the top level menu
	 * @param options Options for closing the menu
	 */
	const closeTopMenu = React.useCallback(
		(options?: CloseOptions) => {
			logger("MenuProvider closeTopMenu");
			const { shouldFocusTrigger = true } = options || {};
			const menu = getTopMenu();
			if (!menu) return;

			if (shouldFocusTrigger) {
				const { id } = menu;
				focusMenuElement(id);
			}

			//Remove the menu
			setCurrentMenus((prev) => prev.slice(0, prev.length - 1));
			setMenuCloseRequest(null);
		},
		[getTopMenu, logger]
	);

	/**
	 * Requests to close the top level menu
	 * @param type The type of close request
	 */
	const requestCloseTopMenu = React.useCallback(
		(type: MenuCloseRequestType) => {
			logger("MenuProvider requestCloseTopMenu");
			const menu = getTopMenu();
			if (!menu) return;

			if (menu.shouldRequestOnClose) {
				setMenuCloseRequest({
					id: menu.id,
					requestTime: Date.now(),
					type,
				});
				return;
			}

			closeTopMenu();
		},
		[closeTopMenu, getTopMenu, logger]
	);

	return (
		<MenuContext.Provider
			value={{
				topMenu: getTopMenu(),
				hasOpenMenu,
				isMenuOpen,
				openMenu,
				canOpenMenu,
				replaceMenu,
				menuCloseRequest,
				requestCloseTopMenu,
				closeTopMenu,
				closeAllMenus,
			}}
		>
			{children}
		</MenuContext.Provider>
	);
}
