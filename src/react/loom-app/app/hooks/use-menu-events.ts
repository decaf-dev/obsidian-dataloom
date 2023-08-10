import React from "react";

import { useMenuOperations } from "src/react/shared/menu/hooks";
import { EVENT_GLOBAL_CLICK } from "src/shared/events";
import { useLogger } from "src/shared/logger";

export const useMenuEvents = () => {
	const hookName = "useMenuEvents";
	const logger = useLogger();
	const { onCloseAll } = useMenuOperations();

	//When an Obsidian modal is opened, close all menus
	React.useEffect(() => {
		function isModalOpen() {
			//A model is open if there is a modal-container element in the body of the document
			return (
				document.body.querySelector(":scope > .modal-container") !==
				null
			);
		}

		const observer = new MutationObserver((entries) => {
			for (let entry of entries) {
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
	}, [logger, onCloseAll]);
};
