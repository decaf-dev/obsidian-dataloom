import React from "react";

import {
	LoomMenu,
	LoomMenuCloseRequestType,
	LoomMenuLevel,
	Position,
} from "./types";
import { createCloseRequest, createMenu } from "./factory";
import { useMountState } from "src/react/loom-app/mount-provider";
import _ from "lodash";
import { useMenuContext } from "../menu-provider";
import { useLogger } from "src/shared/logger";

export const useMenu = ({
	level = LoomMenuLevel.ONE,
	shouldRequestOnClose = false,
} = {}) => {
	const { openMenus, closeRequests, setOpenMenus, setCloseRequests } =
		useMenuContext();
	const [menu] = React.useState(createMenu(level, shouldRequestOnClose));
	const isOpen = openMenus.find((m) => m.id === menu.id) !== undefined;
	const closeRequest =
		closeRequests.find((r) => r.menuId === menu.id) ?? null;
	const { ref, position } = usePosition(isOpen);
	const logger = useLogger();

	/**
	 * Adds the menu to the open menus list
	 */
	const onOpen = React.useCallback(() => {
		logger("onOpen");
		//Wait 10ms so that on mobile, the keyboard can popup and then the menu can already be
		//positioned correctly
		setTimeout(() => {
			setOpenMenus((prevMenus) => {
				const found = prevMenus.find((m) => m.id === menu.id);
				if (found) return prevMenus;
				return [...prevMenus, menu];
			});
		}, 10);
	}, [menu, setOpenMenus, shouldRequestOnClose, logger]);

	/**
	 * Removes the menu from the open menus list.
	 */
	const onClose = React.useCallback(
		(shouldFocusTrigger = true) => {
			logger("onClose", { shouldFocusTrigger });
			setOpenMenus((prevMenus) =>
				prevMenus.filter((m) => m.id !== menu.id)
			);
			setCloseRequests((prevRequests) =>
				prevRequests.filter((request) => request.menuId !== menu.id)
			);
			if (shouldFocusTrigger && ref.current) {
				ref.current.focus();
			}
		},
		[menu, setOpenMenus, setCloseRequests, logger]
	);

	/**
	 * Removes the menu from the open menus list.
	 */
	const onRequestClose = React.useCallback(
		(type: LoomMenuCloseRequestType = "save-and-close") => {
			logger("onRequestClose", { type });
			if (shouldRequestOnClose) {
				const request = createCloseRequest(menu.id, type);
				setCloseRequests((prevRequests) => [...prevRequests, request]);
			} else {
				onClose();
			}
		},
		[menu, setCloseRequests, logger]
	);

	/**
	 * When the menu is unmounted, remove it from the open menus list.
	 * This is necessary for support for the virtualized list
	 */
	// React.useEffect(() => {
	// 	return () => {
	// 		if (isOpen) {
	// 			onClose(false);
	// 		}
	// 	};
	// }, [isOpen]);

	return {
		menu,
		triggerRef: ref,
		triggerPosition: position,
		isOpen,
		closeRequest,
		onOpen,
		onRequestClose,
		onClose,
	};
};

export const useMenuOperations = () => {
	const { openMenus, setOpenMenus, setCloseRequests } = useMenuContext();
	const topMenu = openMenus[openMenus.length - 1] ?? null;

	const canOpen = React.useCallback(
		(menu: LoomMenu) => {
			if (topMenu === null) return true;
			if (menu.level > topMenu.level) return true;
			return false;
		},
		[topMenu]
	);

	const onCloseAll = React.useCallback(() => {
		setOpenMenus((prevState) =>
			prevState.filter((menu) => menu.shouldRequestOnClose)
		);
		setCloseRequests(() => {
			return openMenus.map((menu) =>
				createCloseRequest(menu.id, "save-and-close")
			);
		});
	}, [openMenus]);

	const onRequestCloseTop = React.useCallback(() => {
		if (!topMenu) return;
		if (topMenu.shouldRequestOnClose) {
			const request = createCloseRequest(topMenu.id, "save-and-close");
			setCloseRequests((prevRequests) => [...prevRequests, request]);
		} else {
			setOpenMenus((prevMenus) =>
				prevMenus.filter((menu) => menu.id !== topMenu.id)
			);
		}
	}, [topMenu]);

	return {
		canOpen,
		topMenu,
		onCloseAll,
		onRequestCloseTop,
	};
};

const usePosition = (isOpen: boolean) => {
	const { mountLeaf, isMarkdownView } = useMountState();
	const [position, setPosition] = React.useState<Position>({
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	});
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;

		const THROTTLE_TIME_MILLIS = 100;
		const throttleUpdatePosition = _.throttle(
			updatePosition,
			THROTTLE_TIME_MILLIS
		);

		function updatePosition() {
			const { top, left, width, height } = el.getBoundingClientRect();
			setPosition({
				top,
				left,
				width,
				height,
			});
		}

		const observer = new ResizeObserver(() => throttleUpdatePosition());
		observer.observe(mountLeaf.view.containerEl);

		let pageScrollerEl: HTMLElement | null = null;
		let focusContainerEl: HTMLElement | null = null;
		if (isMarkdownView) {
			pageScrollerEl =
				el.closest(".markdown-preview-view") ??
				el.closest(".cm-scroller");
			pageScrollerEl?.addEventListener("scroll", throttleUpdatePosition);
			focusContainerEl = el.closest(".cm-contentContainer");
			focusContainerEl?.addEventListener(
				"focusin",
				throttleUpdatePosition
			);
		}

		const table = el.closest(".dataloom-table");
		if (table) observer.observe(table);

		//The scroller will only be available for elements rendered in a virtuoso list
		const tableContainer = el.closest('[data-virtuoso-scroller="true"]');
		tableContainer?.addEventListener("scroll", throttleUpdatePosition);

		return () => {
			observer.disconnect();
			tableContainer?.removeEventListener("scroll", updatePosition);
			pageScrollerEl?.removeEventListener(
				"scroll",
				throttleUpdatePosition
			);
			focusContainerEl?.removeEventListener(
				"focusin",
				throttleUpdatePosition
			);
		};
	}, [mountLeaf.view.containerEl, isMarkdownView, isOpen]);

	return {
		ref,
		position,
	};
};
