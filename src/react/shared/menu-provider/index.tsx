import React from "react";

import Logger from "js-logger";
import EventManager from "src/shared/event/event-manager";
import { type LoomMenuPosition } from "../menu/types";
import { createCloseRequest, createMenu } from "./factory";
import {
	type FocusedMenuTrigger,
	type LoomMenu,
	type LoomMenuCloseRequest,
	type LoomMenuCloseRequestType,
	LoomMenuLevel,
} from "./types";
import { getPositionFromEl } from "./utils";

interface ContextProps {
	topMenu: LoomMenu | null;
	getMenu: (
		parentComponentId: string,
		name?: string
	) => {
		id: string;
		isOpen: boolean;
		position: LoomMenuPosition;
		isTriggerFocused: boolean;
		closeRequest: LoomMenuCloseRequest | null;
	};
	onOpen: (
		parentComponentId: string,
		level: LoomMenuLevel,
		triggerRef: React.RefObject<HTMLElement>,
		options?: {
			name?: string;
			shouldRequestOnClose?: boolean;
			shouldFocusTriggerOnClose?: boolean;
		}
	) => void;
	canOpen: (level: LoomMenuLevel) => boolean;
	onClose: (id: string) => void;
	onRequestClose: (id: string, type: LoomMenuCloseRequestType) => void;
	onPositionUpdate: (id: string, value: LoomMenuPosition) => void;
	onCloseAll: () => void;
	onCloseRequestClear: (id: string) => void;
	onClearMenuTriggerFocus: () => void;
}

const MenuContext = React.createContext<ContextProps | null>(null);

export const useMenuContext = () => {
	const value = React.useContext(MenuContext);
	if (value === null) {
		throw new Error(
			"useMenuContext() called without a <MenuProvider /> in the tree."
		);
	}
	return value;
};

interface Props {
	children: React.ReactNode;
}

const CLASS_NAME = "MenuProvider";

export default function MenuProvider({ children }: Props) {
	const [openMenus, setOpenMenus] = React.useState<LoomMenu[]>([]);
	const [closeRequests, setCloseRequests] = React.useState<
		LoomMenuCloseRequest[]
	>([]);
	const [focusedMenuTrigger, setFocusedMenuTrigger] =
		React.useState<FocusedMenuTrigger | null>(null);

	const clearMenuTriggerFocus = React.useCallback(() => {
		Logger.trace(CLASS_NAME, "clearMenuTriggerFocus", "called");
		setFocusedMenuTrigger(null);
	}, []);

	React.useEffect(() => {
		EventManager.getInstance().on(
			"clear-menu-trigger-focus",
			clearMenuTriggerFocus
		);
		return () =>
			EventManager.getInstance().off(
				"clear-menu-trigger-focus",
				clearMenuTriggerFocus
			);
	}, [clearMenuTriggerFocus]);

	function handleOpen(
		parentComponentId: string,
		level: LoomMenuLevel,
		triggerRef: React.RefObject<HTMLElement>,
		options?: {
			name?: string;
			shouldRequestOnClose?: boolean;
			shouldFocusTriggerOnClose?: boolean;
		}
	) {
		Logger.trace(CLASS_NAME, "handleOpenMenu", "called");

		const { name, shouldRequestOnClose, shouldFocusTriggerOnClose } =
			options ?? {};

		if (!triggerRef.current) {
			Logger.debug(
				CLASS_NAME,
				"handleOpenMenu",
				"No trigger ref. Cannot open menu"
			);
			return;
		}
		if (!canOpen(level)) {
			Logger.debug(
				CLASS_NAME,
				"handleOpenMenu",
				"Level is too low. Cannot open menu"
			);
			return;
		}
		Logger.trace(
			CLASS_NAME,
			"handleOpenMenu",
			"MenuProvider opening menu",
			{ level }
		);

		const position = getPositionFromEl(triggerRef.current);
		const menu = createMenu(parentComponentId, level, position, {
			name,
			shouldFocusTriggerOnClose,
			shouldRequestOnClose,
		});

		clearMenuTriggerFocus();
		setOpenMenus((prevMenus) => [...prevMenus, menu]);
	}

	const focusMenuTrigger = React.useCallback(
		(parentComponentId: string, name?: string) => {
			Logger.trace(CLASS_NAME, "focusMenuTrigger", "called", {
				parentComponentId,
				name,
			});
			setFocusedMenuTrigger({
				parentComponentId,
				name,
			});
		},
		[]
	);

	const handleClose = React.useCallback(
		(id: string) => {
			Logger.trace(CLASS_NAME, "handleClose", "called", { id });

			const menu = openMenus.find((menu) => menu.id === id);
			if (!menu) throw new Error("Menu not found");

			if (menu.shouldFocusTriggerOnClose) {
				focusMenuTrigger(menu.parentComponentId, menu.name);
			}
			setOpenMenus((prevMenus) =>
				prevMenus.filter((menu) => menu.id !== id)
			);
			setCloseRequests((prevRequests) =>
				prevRequests.filter((request) => request.menuId !== id)
			);
		},
		[openMenus, focusMenuTrigger]
	);

	const handleRequestClose = React.useCallback(
		(id: string, type: LoomMenuCloseRequestType) => {
			Logger.trace(CLASS_NAME, "onRequestClose", "called", { id, type });
			const menu = openMenus.find((menu) => menu.id === id);
			if (!menu) return;

			const { shouldRequestOnClose } = menu;
			if (shouldRequestOnClose) {
				const request = createCloseRequest(menu.id, type);
				setCloseRequests((prevRequests) => [...prevRequests, request]);
			} else {
				handleClose(id);
			}
		},
		[setCloseRequests, handleClose, openMenus]
	);

	const handlePositionUpdate = React.useCallback(
		(id: string, position: LoomMenuPosition) => {
			Logger.trace(CLASS_NAME, "onPositionUpdate", "called", {
				id,
				position,
			});
			setOpenMenus((prevMenus) => {
				return prevMenus.map((menu) => {
					if (menu.id === id) {
						return { ...menu, position };
					}
					return menu;
				});
			});
		},
		[setOpenMenus]
	);

	function getMenu(parentComponentId: string, name?: string) {
		const menu = openMenus.find((m) => {
			if (m.parentComponentId === parentComponentId) {
				if (name !== undefined) {
					return m.name === name;
				}
				return true;
			}
			return false;
		});

		let closeRequest: LoomMenuCloseRequest | null = null;
		if (menu) {
			closeRequest =
				closeRequests.find((request) => request.menuId === menu.id) ??
				null;
		}

		return {
			id: menu?.id ?? "",
			isOpen: menu !== undefined,
			closeRequest,
			isTriggerFocused:
				focusedMenuTrigger?.parentComponentId === parentComponentId &&
				focusedMenuTrigger?.name === name,
			position: menu?.position ?? {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
			},
		};
	}

	const handleCloseAll = React.useCallback(() => {
		Logger.trace(CLASS_NAME, "handleCloseAll", "called");
		setOpenMenus((prevState) =>
			prevState.filter((menu) => menu.shouldRequestOnClose)
		);
		setCloseRequests(() => {
			return openMenus.map((menu) =>
				createCloseRequest(menu.id, "save-and-close")
			);
		});
	}, [openMenus, setOpenMenus]);

	const getTopMenu = React.useCallback(() => {
		return openMenus[openMenus.length - 1] ?? null;
	}, [openMenus]);

	const canOpen = React.useCallback(
		(level: LoomMenuLevel) => {
			const topMenu = getTopMenu();
			if (topMenu === null) return true;
			if (level > topMenu.level) return true;
			return false;
		},
		[getTopMenu]
	);

	function handleCloseRequestClear(id: string) {
		Logger.trace(CLASS_NAME, "handleCloseRequestClear", "called", { id });
		setCloseRequests((prevRequests) =>
			prevRequests.filter((request) => request.menuId !== id)
		);
	}

	return (
		<MenuContext.Provider
			value={{
				topMenu: getTopMenu(),
				canOpen,
				getMenu,
				onOpen: handleOpen,
				onClose: handleClose,
				onRequestClose: handleRequestClose,
				onPositionUpdate: handlePositionUpdate,
				onCloseAll: handleCloseAll,
				onCloseRequestClear: handleCloseRequestClear,
				onClearMenuTriggerFocus: clearMenuTriggerFocus,
			}}
		>
			{children}
		</MenuContext.Provider>
	);
}
