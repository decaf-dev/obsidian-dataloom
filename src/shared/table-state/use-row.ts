import React from "react";
import { TableState } from "src/shared/table-state/types";
import { useLogger } from "../logger";
import { useAppContext } from "./app-context";
import { WorkspaceLeaf } from "obsidian";
import { EVENT_ROW_ADD, EVENT_ROW_DELETE } from "../events";
import { rowAdd, rowDelete } from "./row-state-operations";
import { useAppDispatch } from "src/redux/global/hooks";
import { updateSortTime } from "src/redux/global/global-slice";

export const useRow = (
	viewLeaf: WorkspaceLeaf,
	onChange: React.Dispatch<React.SetStateAction<TableState>>
) => {
	const logFunc = useLogger();
	const app = useAppContext();
	const dispatch = useAppDispatch();

	React.useEffect(() => {
		//@ts-expect-error unknown event type
		app.workspace.on(EVENT_ROW_ADD, (leaf: WorkspaceLeaf) => {
			if (leaf === viewLeaf) {
				onChange((prevState) => rowAdd(prevState));
			}
		});

		//@ts-expect-error unknown event type
		app.workspace.on(EVENT_ROW_DELETE, (leaf: WorkspaceLeaf) => {
			if (leaf === viewLeaf) {
				onChange((prevState) => rowDelete(prevState, { last: true }));
			}
		});
	}, [app]);

	function handleRowDeleteClick(rowId: string) {
		logFunc("handleRowDeleteClick", {
			rowId,
		});
		onChange((prevState) => rowDelete(prevState, { id: rowId }));
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
