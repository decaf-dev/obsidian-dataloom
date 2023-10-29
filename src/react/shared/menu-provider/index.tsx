import React from "react";

import { LoomMenuPosition } from "../menu/types";
import { createCloseRequest, createMenu } from "./factory";
import {
	FocusedMenuTrigger,
	LoomMenu,
	LoomMenuCloseRequest,
	LoomMenuCloseRequestType,
	LoomMenuLevel,
} from "./types";
import { useLogger } from "src/shared/logger";
import { findMenuTriggerEl, getPositionFromEl } from "./utils";

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
		}
	) => void;
	canOpen: (level: LoomMenuLevel) => boolean;
	onClose: (id: string) => void;
	onRequestClose: (id: string, type: LoomMenuCloseRequestType) => void;
	onPositionUpdate: (id: string, value: LoomMenuPosition) => void;
	onCloseAll: () => void;
	onCloseRequestClear: (id: string) => void;
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

export default function MenuProvider({ children }: Props) {
	const [openMenus, setOpenMenus] = React.useState<LoomMenu[]>([]);
	const [closeRequests, setCloseRequests] = React.useState<
		LoomMenuCloseRequest[]
	>([]);
	const [focusedMenuTrigger, setFocusedMenuTrigger] =
		React.useState<FocusedMenuTrigger | null>(null);

	const logger = useLogger();

	function handleOpen(
		parentComponentId: string,
		level: LoomMenuLevel,
		triggerRef: React.RefObject<HTMLElement>,
		options?: {
			name?: string;
			shouldRequestOnClose?: boolean;
		}
	) {
		logger("MenuProvider handleOpenMenu");

		const { name, shouldRequestOnClose } = options ?? {};

		if (!triggerRef.current) return;
		if (!canOpen(level)) return;

		const position = getPositionFromEl(triggerRef.current);
		const menu = createMenu(parentComponentId, level, position, {
			name,
			shouldRequestOnClose,
		});

		clearMenuTriggerFocus();
		setOpenMenus((prevMenus) => [...prevMenus, menu]);
	}

	function focusMenuTrigger(parentComponentId: string, name?: string) {
		logger("MenuProvider focusMenuTrigger");
		setFocusedMenuTrigger({
			parentComponentId,
			name,
		});
	}

	function clearMenuTriggerFocus() {
		logger("MenuProvider clearMenuTriggerFocus");
		setFocusedMenuTrigger(null);
	}

	const handleClose = React.useCallback(
		(id: string) => {
			logger("MenuProvider onClose");

			const menu = openMenus.find((menu) => menu.id === id);
			if (!menu) throw new Error("Menu not found");

			console.log("Closing menu", menu);

			focusMenuTrigger(menu.parentComponentId, menu.name);
			setOpenMenus((prevMenus) =>
				prevMenus.filter((menu) => menu.id !== id)
			);
			setCloseRequests((prevRequests) =>
				prevRequests.filter((request) => request.menuId !== id)
			);
		},
		[logger, openMenus]
	);

	const handleRequestClose = React.useCallback(
		(id: string, type: LoomMenuCloseRequestType) => {
			logger("MenuProvider onRequestClose", { type });
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
		[logger, setCloseRequests, handleClose, openMenus]
	);

	const handlePositionUpdate = React.useCallback(
		(id: string, position: LoomMenuPosition) => {
			logger("MenuProvider onPositionUpdate", { id, position });
			setOpenMenus((prevMenus) => {
				return prevMenus.map((menu) => {
					if (menu.id === id) {
						return { ...menu, position };
					}
					return menu;
				});
			});
		},
		[setOpenMenus, logger]
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
			}}
		>
			{children}
		</MenuContext.Provider>
	);
}
