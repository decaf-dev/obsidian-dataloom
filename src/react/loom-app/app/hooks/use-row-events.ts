import React from "react";
import RowAddCommand from "src/shared/loom-state/commands/row-add-command";
import RowDeleteCommand from "src/shared/loom-state/commands/row-delete-command";
import { isEventForThisApp } from "src/shared/event/utils";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import { useAppMount } from "../../app-mount-provider";
import EventManager from "src/shared/event/event-manager";

export const useRowEvents = () => {
	const { reactAppId, app } = useAppMount();
	const { doCommand } = useLoomState();

	React.useEffect(() => {
		function handleRowAddEvent() {
			if (isEventForThisApp(reactAppId)) doCommand(new RowAddCommand());
		}

		function handleRowDeleteEvent() {
			if (isEventForThisApp(reactAppId))
				doCommand(new RowDeleteCommand({ last: true }));
		}

		EventManager.getInstance().on("add-row", handleRowAddEvent);
		EventManager.getInstance().on("delete-row", handleRowDeleteEvent);

		return () => {
			EventManager.getInstance().off("add-row", handleRowAddEvent);
			EventManager.getInstance().off("delete-row", handleRowDeleteEvent);
		};
	}, [doCommand, app, reactAppId]);
};
