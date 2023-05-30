import React from "react";
import { useLogger } from "../logger";
import { WorkspaceLeaf } from "obsidian";
import { EVENT_ROW_ADD, EVENT_ROW_DELETE } from "../events";
import { useTableState } from "./table-state-context";
import RowAddCommand from "../commands/row-add-command";
import RowDeleteCommand from "../commands/row-delete-command";
import { isEventForThisLeaf } from "../renderUtils";

export const useRow = () => {
	const logger = useLogger();
	const { doCommand } = useTableState();

	React.useEffect(() => {
		function handleRowAddEvent(leaf: WorkspaceLeaf) {
			if (!isEventForThisLeaf(leaf)) return;
			doCommand(new RowAddCommand());
		}

		function handleRowDeleteEvent(leaf: WorkspaceLeaf) {
			if (!isEventForThisLeaf(leaf)) return;

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
	}, [doCommand]);

	function handleRowDeleteClick(rowId: string) {
		logger("handleRowDeleteClick", {
			rowId,
		});
		doCommand(new RowDeleteCommand({ id: rowId }));
	}

	function handleNewRowClick() {
		logger("handleNewRowClick");
		doCommand(new RowAddCommand());
	}

	return {
		handleNewRowClick,
		handleRowDeleteClick,
	};
};
