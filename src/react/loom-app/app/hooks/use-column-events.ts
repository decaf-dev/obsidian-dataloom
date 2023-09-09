import React from "react";
import ColumnAddCommand from "src/shared/loom-state/commands/column-add-command";
import ColumnDeleteCommand from "src/shared/loom-state/commands/column-delete-command";
import { isEventForThisApp } from "src/shared/event-system/utils";
import { EVENT_COLUMN_ADD, EVENT_COLUMN_DELETE } from "src/shared/events";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import { useAppMount } from "../../app-mount-provider";

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
		//@ts-expect-error missing overload
		app.workspace.on(EVENT_COLUMN_ADD, handleColumnAddEvent);

		//@ts-expect-error missing overload
		app.workspace.on(EVENT_COLUMN_DELETE, handleColumnDeleteEvent);

		return () => {
			app.workspace.off(EVENT_COLUMN_ADD, handleColumnAddEvent);
			app.workspace.off(EVENT_COLUMN_DELETE, handleColumnDeleteEvent);
		};
	}, [doCommand, logger, reactAppId, app]);
};
