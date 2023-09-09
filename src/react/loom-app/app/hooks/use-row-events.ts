import React from "react";
import RowAddCommand from "src/shared/loom-state/commands/row-add-command";
import RowDeleteCommand from "src/shared/loom-state/commands/row-delete-command";
import { isEventForThisApp } from "src/shared/event-system/utils";
import { EVENT_ROW_ADD, EVENT_ROW_DELETE } from "src/shared/events";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import { useAppMount } from "../../app-mount-provider";

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

		//@ts-expect-error unknown event type
		app.workspace.on(EVENT_ROW_ADD, handleRowAddEvent);
		//@ts-expect-error unknown event type
		app.workspace.on(EVENT_ROW_DELETE, handleRowDeleteEvent);

		return () => {
			app.workspace.off(EVENT_ROW_ADD, handleRowAddEvent);
			app.workspace.off(EVENT_ROW_DELETE, handleRowDeleteEvent);
		};
	}, [doCommand, app, reactAppId]);
};
