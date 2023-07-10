import React from "react";
import RowAddCommand from "src/shared/commands/row-add-command";
import RowDeleteCommand from "src/shared/commands/row-delete-command";
import { isEventForThisApp } from "src/shared/event-system/utils";
import { EVENT_ROW_ADD, EVENT_ROW_DELETE } from "src/shared/events";
import { useLoomState } from "src/shared/table-state/loom-state-context";
import { useMountState } from "../../react/table-app/mount-provider";

export const useRowEvents = () => {
	const { appId } = useMountState();
	const { doCommand } = useLoomState();

	React.useEffect(() => {
		function handleRowAddEvent() {
			if (isEventForThisApp(appId)) doCommand(new RowAddCommand());
		}

		function handleRowDeleteEvent() {
			if (isEventForThisApp(appId))
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
	}, [doCommand, appId]);
};
