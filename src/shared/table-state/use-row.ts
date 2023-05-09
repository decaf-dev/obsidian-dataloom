import React from "react";
import { TableState } from "src/shared/table-state/types";
import { useLogger } from "../logger";
import { WorkspaceLeaf } from "obsidian";
import { EVENT_ROW_ADD, EVENT_ROW_DELETE } from "../events";
import { RowDeleteCommand, rowAdd, rowDelete } from "./row-state-operations";
import { useAppDispatch } from "src/redux/global/hooks";
import { updateSortTime } from "src/redux/global/global-slice";
import { useTableState } from "./table-state-context";

export const useRow = (
	viewLeaf: WorkspaceLeaf,
	onChange: React.Dispatch<React.SetStateAction<TableState>>
) => {
	const logFunc = useLogger();
	const dispatch = useAppDispatch();
	const { doCommand } = useTableState();

	React.useEffect(() => {
		function handleRowAddEvent(leaf: WorkspaceLeaf) {
			if (leaf === viewLeaf) {
				onChange((prevState) => rowAdd(prevState));
			}
		}

		function handleRowDeleteEvent(leaf: WorkspaceLeaf) {
			if (leaf === viewLeaf) {
				onChange((prevState) => rowDelete(prevState, { last: true }));
			}
		}

		//@ts-expect-error unknown event type
		app.workspace.on(EVENT_ROW_ADD, handleRowAddEvent);
		//@ts-expect-error unknown event type
		app.workspace.on(EVENT_ROW_DELETE, handleRowDeleteEvent);

		return () => {
			app.workspace.off(EVENT_ROW_ADD, handleRowAddEvent);
			app.workspace.off(EVENT_ROW_DELETE, handleRowDeleteEvent);
		};
	}, []);

	function handleRowDeleteClick(rowId: string) {
		logFunc("handleRowDeleteClick", {
			rowId,
		});
		doCommand(new RowDeleteCommand(rowId));
		//onChange((prevState) => rowDelete(prevState, { id: rowId }));
	}

	function handleNewRowClick() {
		logFunc("handleNewRowClick");
		onChange((prevState) => rowAdd(prevState));
		dispatch(updateSortTime());
	}

	return {
		handleNewRowClick,
		handleRowDeleteClick,
	};
};
