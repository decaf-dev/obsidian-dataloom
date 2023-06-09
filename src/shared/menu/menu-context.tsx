import React from "react";
import { focusMenuElement, removeFocusVisibleClass } from "./focus-visible";
import { MenuCloseRequest, MenuCloseRequestType, NltMenu } from "./types";

interface CloseOptions {
	shouldFocusTrigger?: boolean;
	forceClose?: boolean;
}

interface ContextProps {
	topMenu: NltMenu | null;
	menuCloseRequest: MenuCloseRequest | null;
	openMenu: (menu: NltMenu) => void;
	hasOpenMenu: () => boolean;
	canOpenMenu: (menu: NltMenu) => boolean;
	isMenuOpen: (menu: NltMenu) => boolean;
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
	const [currentMenus, setCurrentMenus] = React.useState<NltMenu[]>([]);

	const [menuCloseRequest, setMenuCloseRequest] =
		React.useState<MenuCloseRequest | null>(null);

	/**
	 * Whether or not text is currently highlighted
	 */
	const isTextHighlighted = React.useRef(false);

	/**
	 * Returns whether or not a menu is open
	 */
	const isMenuOpen = React.useCallback(
		(menu: NltMenu) => {
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

	const canOpenMenu = React.useCallback(
		(menu: NltMenu) => {
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
		(menu: NltMenu) => {
			if (!canOpenMenu(menu)) return;

			setCurrentMenus((prev) => [...prev, menu]);

			//When we close a menu, we add the focus class to the parent element.
			//If we then click on another menu, we will remove the focus class. Without this,
			//we will have 2 parent elements that are focused
			removeFocusVisibleClass();
		},
		[canOpenMenu]
	);

	/**
	 * Closes all menus
	 * @param shouldFocusTrigger should focus the menu trigger when on close
	 */
	function closeAllMenus(shouldFocusTrigger = true) {
		const menu = currentMenus.first();
		if (!menu) return;

		if (shouldFocusTrigger) {
			const { id } = menu;
			focusMenuElement(id);
		}

		setCurrentMenus([]);
		setMenuCloseRequest(null);
		isTextHighlighted.current = false;
	}

	/**
	 * Closes the top level menu
	 * @param options Options for closing the menu
	 */
	const closeTopMenu = React.useCallback(
		(options?: CloseOptions) => {
			const { shouldFocusTrigger = true } = options || {};
			const menu = currentMenus.last();
			if (!menu) return;

			if (shouldFocusTrigger) {
				const { id } = menu;
				focusMenuElement(id);
			}

			//Remove the menu
			setCurrentMenus((prev) => prev.slice(0, prev.length - 1));
			setMenuCloseRequest(null);
			isTextHighlighted.current = false;
		},
		[currentMenus]
	);

	/**
	 * Requests to close the top level menu
	 * @param type The type of close request
	 */
	const requestCloseTopMenu = React.useCallback(
		(type: MenuCloseRequestType) => {
			const menu = currentMenus.last();
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
		[currentMenus, closeTopMenu]
	);

	return (
		<MenuContext.Provider
			value={{
				topMenu: currentMenus.last() ?? null,
				hasOpenMenu,
				isMenuOpen,
				openMenu,
				canOpenMenu,
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
