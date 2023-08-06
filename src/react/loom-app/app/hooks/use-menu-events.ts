import React from "react";
import { useMountState } from "src/react/loom-app/mount-provider";
import { EVENT_GLOBAL_CLICK, EVENT_GLOBAL_KEYDOWN } from "src/shared/events";
import { useLogger } from "src/shared/logger";
import { useMenuState } from "src/react/loom-app/menu-provider";

export const useMenuEvents = (
	id: string,
	isOpen: boolean,
	isTextHighlighted: boolean
) => {
	const { app } = useMountState();
	const logger = useLogger();
	const { requestCloseTopMenu, closeTopMenu, topMenu, closeAllMenus } =
		useMenuState();

	//When an Obsidian modal is opened, close all menus
	React.useEffect(() => {
		function isModalOpen() {
			return (
				document.body.querySelector(":scope > .modal-container") !==
				null
			);
		}

		// Create a new ResizeObserver instance
		const mutationObserver = new MutationObserver((entries) => {
			for (let entry of entries) {
				if (entry.target === document.body) {
					if (isModalOpen()) {
						closeAllMenus();
						break;
					}
				}
			}
		});

		// Start observing the body element
		mutationObserver.observe(document.body, { childList: true });

		return () => mutationObserver.disconnect();
	}, [closeAllMenus]);

	//Handle outside keydown
	//The events are triggered from the Obsidian event registered in main.ts
	React.useEffect(() => {
		function handleOutsideKeyDown(e: KeyboardEvent) {
			logger("Menu handleOutsideKeyDown");
			if (topMenu?.id !== id) return;

			if (e.key === "Enter") {
				requestCloseTopMenu("enter");
			} else if (e.key === "Escape") {
				closeTopMenu();
			}
		}

		if (isOpen) {
			//@ts-expect-error not a native Obsidian event
			app.workspace.on(EVENT_GLOBAL_KEYDOWN, handleOutsideKeyDown);
		}

		return () =>
			app.workspace.off(EVENT_GLOBAL_CLICK, handleOutsideKeyDown);
	}, [isOpen, logger, closeTopMenu, requestCloseTopMenu, id, app, topMenu]);

	//Handle outside clicks
	//The events are triggered from the Obsidian event registered in main.ts
	React.useEffect(() => {
		function handleOutsideClick() {
			logger("Menu handleOutsideClick");
			if (topMenu?.id !== id) return;

			//If we just highlighted text in an input and we released the mouse outside of the
			//menu, don't close the menu
			if (isTextHighlighted) {
				return;
			}
			requestCloseTopMenu("click");
		}

		if (isOpen) {
			//@ts-expect-error not a native Obsidian event
			app.workspace.on(EVENT_GLOBAL_CLICK, handleOutsideClick);
		}

		return () => app.workspace.off(EVENT_GLOBAL_CLICK, handleOutsideClick);
	}, [isOpen, logger, requestCloseTopMenu, id, topMenu, isTextHighlighted]);
};
