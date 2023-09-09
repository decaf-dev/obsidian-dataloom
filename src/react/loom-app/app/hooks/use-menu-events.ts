import React from "react";

import { useMenuOperations } from "src/react/shared/menu/hooks";
import { EVENT_GLOBAL_CLICK } from "src/shared/events";
import { useLogger } from "src/shared/logger";
import { useAppMount } from "../../app-mount-provider";
import _ from "lodash";

export const useMenuEvents = () => {
	const hookName = "useMenuEvents";
	const logger = useLogger();
	const { reactAppId, isMarkdownView, app } = useAppMount();
	const { onCloseAll } = useMenuOperations();

	React.useEffect(() => {
		const THROTTLE_TIME_MILLIS = 100;
		const throttleHandleScroll = _.throttle(
			handleScroll,
			THROTTLE_TIME_MILLIS
		);

		function handleScroll() {
			//Find any open menus
			const openMenus = document.querySelectorAll(".dataloom-menu");

			//Since it takes a noticable amount of time for React to update the DOM, we set
			//the display to none and then wait for React to clean up the DOM
			for (const menu of openMenus) {
				(menu as HTMLElement).style.display = "none";
			}
			onCloseAll();
		}

		const appEl = document.getElementById(reactAppId);
		if (!appEl) return;

		const tableContainer = appEl.querySelector(
			'[data-virtuoso-scroller="true"]'
		) as HTMLElement | null;
		if (!tableContainer) return;

		tableContainer.addEventListener("scroll", throttleHandleScroll);
		return () =>
			tableContainer?.removeEventListener("scroll", throttleHandleScroll);
	}, [onCloseAll, reactAppId]);

	/**
	 * If the app is rendered in an MarkdownView, close all menus when the user scrolls
	 */
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

	/**
	 * If an Obsidian modal is opened, close all menus
	 */
	React.useEffect(() => {
		function isModalOpen() {
			//A model is open if there is a modal-container element in the body of the document
			return (
				document.body.querySelector(":scope > .modal-container") !==
				null
			);
		}

		const observer = new MutationObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === document.body) {
					if (isModalOpen()) {
						logger(`${hookName} onCloseAll`);
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

	React.useEffect(() => {
		function handleGlobalClick() {
			logger(`${hookName} handleGlobalClick`);

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
