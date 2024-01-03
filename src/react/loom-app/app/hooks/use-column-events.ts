import React from "react";
import ColumnAddCommand from "src/shared/loom-state/commands/column-add-command";
import ColumnDeleteCommand from "src/shared/loom-state/commands/column-delete-command";
import { isEventForThisApp } from "src/shared/event/utils";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import { useAppMount } from "../../app-mount-provider";
import EventManager from "src/shared/event/event-manager";
import Logger from "js-logger";

export const useColumnEvents = () => {
	const { reactAppId, app } = useAppMount();
	const { doCommand } = useLoomState();

	React.useEffect(() => {
		function handleColumnAddEvent() {
			if (isEventForThisApp(reactAppId)) {
				Logger.trace("handleColumnAddEvent");
				doCommand(new ColumnAddCommand());
			}
		}

		function handleColumnDeleteEvent() {
			if (isEventForThisApp(reactAppId)) {
				Logger.trace("handleColumnDeleteEvent");
				doCommand(new ColumnDeleteCommand({ last: true }));
			}
		}
		EventManager.getInstance().on("add-column", handleColumnAddEvent);
		EventManager.getInstance().on("delete-column", handleColumnDeleteEvent);

		return () => {
			EventManager.getInstance().off("add-column", handleColumnAddEvent);
			EventManager.getInstance().off(
				"delete-column",
				handleColumnDeleteEvent
			);
		};
	}, [doCommand, reactAppId, app]);
};
