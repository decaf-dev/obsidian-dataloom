import React from "react";

import { LoomMenuCloseRequestType, LoomMenuLevel, Position } from "./types";
import { createCloseRequest, createMenu, createMenuId } from "./factory";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { menuCloseRequestsAtom, openMenusAtom } from "./atom/atoms";
import {
	closeRequestSelector,
	isMenuOpenSelector,
	topMenuSelector,
} from "./atom/selectors";
import { useMountState } from "src/react/loom-app/mount-provider";
import _ from "lodash";

export const useMenu = ({
	level = LoomMenuLevel.ONE,
	shouldRequestOnClose = false,
} = {}) => {
	const [id] = React.useState(createMenuId());
	const isOpen = useRecoilValue(isMenuOpenSelector(id));
	const closeRequest = useRecoilValue(closeRequestSelector(id));
	const setOpenMenus = useSetRecoilState(openMenusAtom);
	const setCloseRequests = useSetRecoilState(menuCloseRequestsAtom);

	const { ref, position } = usePosition();

	/**
	 * Adds the menu to the open menus list
	 */
	const onOpen = React.useCallback(() => {
		setOpenMenus((prevMenus) => {
			if (prevMenus.length !== 0) {
				const topMenu = prevMenus[prevMenus.length - 1];
				if (topMenu.level <= level) return prevMenus;
			}

			const found = prevMenus.find((m) => m.id === id);
			if (found) return prevMenus;

			const menu = createMenu(id, level, shouldRequestOnClose);
			return [...prevMenus, menu];
		});
	}, [id, level, setOpenMenus, shouldRequestOnClose]);

	/**
	 * Removes the menu from the open menus list.
	 */
	const onClose = React.useCallback(
		(shouldFocusTrigger = true) => {
			setTimeout(() => {
				setOpenMenus((prevMenus) =>
					prevMenus.filter((menu) => menu.id !== id)
				);
				setCloseRequests((prevRequests) =>
					prevRequests.filter((request) => request.menuId !== id)
				);
				if (shouldFocusTrigger && ref.current) {
					ref.current.focus();
				}
			}, 1);
		},
		[id, shouldRequestOnClose, setOpenMenus, setCloseRequests]
	);

	/**
	 * Removes the menu from the open menus list.
	 */
	const onRequestClose = React.useCallback(
		(type: LoomMenuCloseRequestType = "save-and-close") => {
			if (shouldRequestOnClose) {
				const request = createCloseRequest(id, type);
				setCloseRequests((prevRequests) => [...prevRequests, request]);
			} else {
				onClose();
			}
		},
		[id, shouldRequestOnClose, setCloseRequests]
	);

	React.useEffect(() => {
		return () => onClose(false);
	}, []);

	return {
		menuId: id,
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
	const topMenu = useRecoilValue(topMenuSelector);
	const openMenus = useRecoilValue(openMenusAtom);
	const setOpenMenus = useSetRecoilState(openMenusAtom);
	const setCloseRequests = useSetRecoilState(menuCloseRequestsAtom);

	const isMenuOpen = React.useCallback(() => {
		return openMenus.length !== 0;
	}, [openMenus]);

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
		isMenuOpen,
		topMenu,
		onCloseAll,
		onRequestCloseTop,
	};
};

const usePosition = () => {
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
		const throttleUpdatePosition = _.throttle(updatePosition, 100);

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
		const tableScroller = el.closest('[data-virtuoso-scroller="true"]');
		tableScroller?.addEventListener("scroll", throttleUpdatePosition);

		return () => {
			observer.disconnect();
			tableScroller?.removeEventListener("scroll", updatePosition);
			pageScrollerEl?.removeEventListener(
				"scroll",
				throttleUpdatePosition
			);
			focusContainerEl?.removeEventListener(
				"focusin",
				throttleUpdatePosition
			);
		};
	}, [mountLeaf.view.containerEl, isMarkdownView]);

	return {
		ref,
		position,
	};
};
