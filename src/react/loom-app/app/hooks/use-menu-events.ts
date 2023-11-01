import React from "react";

import { EVENT_GLOBAL_CLICK } from "src/shared/events";
import { useLogger } from "src/shared/logger";
import { useAppMount } from "../../app-mount-provider";
import _ from "lodash";
import { useMenuOperations } from "src/react/shared/menu-provider/hooks";

export const useMenuEvents = () => {
	useCloseOnOutsideClick();
	useCloseOnObsidianModalOpen();
	useCloseOnMarkdownViewScroll();
	useLockTableScroll();
};

const useLockTableScroll = () => {
	const { reactAppId } = useAppMount();
	const { topMenu } = useMenuOperations();
	const logger = useLogger();
	const hasLockRef = React.useRef(false);

	React.useEffect(() => {
		const appEl = document.getElementById(reactAppId);
		if (!appEl) return;

		const tableContainerEl = appEl.querySelector(
			'[data-virtuoso-scroller="true"]'
		) as HTMLElement | null;
		if (!tableContainerEl) return;

		if (topMenu) {
			if (hasLockRef.current) return;
			hasLockRef.current = true;

			const { parentComponentId } = topMenu;
			if (!parentComponentId?.includes("cell")) return;

			logger("useLockTableScroll cell menu opened. locking table scroll");
			tableContainerEl.style.overflow = "hidden";
		} else {
			hasLockRef.current = false;
			logger(
				"useLockTableScroll cell menu closed. unlocking table scroll"
			);
			tableContainerEl.style.overflow = "auto";
		}
	}, [topMenu, logger]);
};

/**
 * If the app is rendered in an MarkdownView, close all menus when the user scrolls
 */
const useCloseOnMarkdownViewScroll = () => {
	const { reactAppId, isMarkdownView } = useAppMount();
	const { onCloseAll } = useMenuOperations();

	React.useEffect(() => {
		let pageScrollerEl: HTMLElement | null;

		const THROTTLE_TIME_MILLIS = 100;
		const throttleHandleScroll = _.throttle(
			handleScroll,
			THROTTLE_TIME_MILLIS
		);

		function handleScroll() {
			//Find any open menus
			const openMenus = document.querySelectorAll(".dataloom-menu");
			if (openMenus.length === 0) return;

			//Since it takes a noticable amount of time for React to update the DOM, we set
			//the display to none and then wait for React to clean up the DOM
			for (const menu of openMenus) {
				(menu as HTMLElement).style.display = "none";
			}

			onCloseAll();
		}

		if (isMarkdownView) {
			const appEl = document.getElementById(reactAppId);
			if (!appEl) return;

			pageScrollerEl =
				appEl.closest(".markdown-preview-view") ??
				appEl.closest(".cm-scroller");
			pageScrollerEl?.addEventListener("scroll", throttleHandleScroll);
		}
		return () =>
			pageScrollerEl?.removeEventListener("scroll", throttleHandleScroll);
	}, [onCloseAll, isMarkdownView, reactAppId]);
};

/**
 * If the user clicks outside the app, close all menus
 */
const useCloseOnOutsideClick = () => {
	const { app } = useAppMount();
	const { onCloseAll } = useMenuOperations();

	const logger = useLogger();

	React.useEffect(() => {
		function handleGlobalClick() {
			logger("handleGlobalClick");

			//If the user selected text and then released outside the app
			//we don't want to close the menu
			// const selection = window.getSelection();
			// if (selection && selection.toString().length > 0) return;

			onCloseAll();
		}

		//@ts-expect-error not a native Obsidian event
		app.workspace.on(EVENT_GLOBAL_CLICK, handleGlobalClick);

		return () => app.workspace.off(EVENT_GLOBAL_CLICK, handleGlobalClick);
	}, [app, logger, onCloseAll]);
};

/**
 * If an Obsidian modal is opened, close all menus
 */
const useCloseOnObsidianModalOpen = () => {
	const hasCloseLock = React.useRef(false);
	const { topMenu, onCloseAll } = useMenuOperations();

	const logger = useLogger();

	React.useEffect(() => {
		if (!topMenu) hasCloseLock.current = false;
	}, [topMenu]);

	React.useEffect(() => {
		function hasOpenModal() {
			return document.querySelector("body > .modal-container") !== null;
		}

		const observer = new MutationObserver((entries) => {
			if (hasCloseLock.current) return;

			for (const entry of entries) {
				if (entry.target === document.body) {
					if (hasOpenModal()) {
						logger("obsidian modal opened. closing all menus");
						hasCloseLock.current = true;
						onCloseAll();
						break;
					}
				}
			}
		});

		// Start observing the body element
		observer.observe(document.body, { childList: true });

		return () => observer.disconnect();
	}, [logger, onCloseAll]);
};
