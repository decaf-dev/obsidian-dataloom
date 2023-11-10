import React from "react";
import ColumnAddCommand from "src/shared/loom-state/commands/column-add-command";
import ColumnDeleteCommand from "src/shared/loom-state/commands/column-delete-command";
import { isEventForThisApp } from "src/shared/event/utils";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import { useAppMount } from "../../app-mount-provider";
import EventListener from "src/shared/event/event-listener";

export const useColumnEvents = () => {
	const { reactAppId, app } = useAppMount();
	const { doCommand } = useLoomState();
	const logger = useLogger();

	React.useEffect(() => {
		function handleColumnAddEvent() {
			if (isEventForThisApp(reactAppId)) {
				logger("handleColumnAddEvent");
				doCommand(new ColumnAddCommand());
			}
		}

		function handleColumnDeleteEvent() {
			if (isEventForThisApp(reactAppId)) {
				logger("handleColumnDeleteEvent");
				doCommand(new ColumnDeleteCommand({ last: true }));
			}
		}
		EventListener.getInstance().on("add-column", handleColumnAddEvent);
		EventListener.getInstance().on(
			"delete-column",
			handleColumnDeleteEvent
		);

		return () => {
			EventListener.getInstance().off("add-column", handleColumnAddEvent);
			EventListener.getInstance().off(
				"delete-column",
				handleColumnDeleteEvent
			);
		};
	}, [doCommand, logger, reactAppId, app]);
};
