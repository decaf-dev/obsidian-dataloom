import React from "react";
import ColumnAddCommand from "src/shared/commands/column-add-command";
import ColumnDeleteCommand from "src/shared/commands/column-delete-command";
import { isEventForThisApp } from "src/shared/event-system/utils";
import { EVENT_COLUMN_ADD, EVENT_COLUMN_DELETE } from "src/shared/events";
import { useLogger } from "src/shared/logger";
import { useTableState } from "src/shared/dashboard-state/dashboard-state-context";
import { useMountState } from "../../react/dashboard-app/mount-provider";

export const useColumnEvents = () => {
	const { appId } = useMountState();
	const { doCommand } = useTableState();
	const logger = useLogger();

	React.useEffect(() => {
		function handleColumnAddEvent() {
			if (isEventForThisApp(appId)) {
				logger("handleColumnAddEvent");
				doCommand(new ColumnAddCommand());
			}
		}

		function handleColumnDeleteEvent() {
			if (isEventForThisApp(appId)) {
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
	}, [doCommand, logger, appId]);
};
