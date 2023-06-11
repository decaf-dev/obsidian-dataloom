import React from "react";
import { EVENT_OUTSIDE_CLICK, EVENT_OUTSIDE_KEYDOWN } from "src/shared/events";
import { useLogger } from "src/shared/logger";
import { useMenuState } from "src/shared/menu/menu-context";

export const useMenuEvents = (
	id: string,
	isOpen: boolean,
	isTextHighlighted: boolean
) => {
	const logger = useLogger();
	const { requestCloseTopMenu, closeTopMenu, topMenu } = useMenuState();

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
			app.workspace.on(EVENT_OUTSIDE_KEYDOWN, handleOutsideKeyDown);
		}

		return () =>
			app.workspace.off(EVENT_OUTSIDE_CLICK, handleOutsideKeyDown);
	}, [isOpen, logger, closeTopMenu, requestCloseTopMenu, id, topMenu]);

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
			app.workspace.on(EVENT_OUTSIDE_CLICK, handleOutsideClick);
		}

		return () => app.workspace.off(EVENT_OUTSIDE_CLICK, handleOutsideClick);
	}, [isOpen, logger, requestCloseTopMenu, id, topMenu, isTextHighlighted]);
};
