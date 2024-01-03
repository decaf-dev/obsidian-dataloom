import { useLoomState } from "../../loom-state-provider";
import RowAddCommand from "src/shared/loom-state/commands/row-add-command";
import RowDeleteCommand from "src/shared/loom-state/commands/row-delete-command";
import React from "react";
import RowInsertCommand from "src/shared/loom-state/commands/row-insert-command";
import { confirmSortOrderChange } from "src/shared/sort-utils";
import RowReorderCommand from "src/shared/loom-state/commands/row-reorder-command";
import Logger from "js-logger";

export const useRow = () => {
	const { doCommand, loomState } = useLoomState();

	const handleRowDeleteClick = React.useCallback(
		(rowId: string) => {
			Logger.trace("handleRowDeleteClick", {
				rowId,
			});
			doCommand(new RowDeleteCommand({ id: rowId }));
		},
		[doCommand]
	);

	const handleNewRowClick = React.useCallback(() => {
		Logger.trace("handleNewRowClick");
		doCommand(new RowAddCommand());
	}, [doCommand]);

	const handleRowInsertAboveClick = React.useCallback(
		(rowId: string) => {
			Logger.trace("handleRowInsertAboveClick", {
				rowId,
			});
			if (confirmSortOrderChange(loomState)) {
				doCommand(new RowInsertCommand(rowId, "above"));
			}
		},
		[doCommand, loomState]
	);

	const handleRowInsertBelowClick = React.useCallback(
		(rowId: string) => {
			Logger.trace("handleRowInsertBelowClick", {
				rowId,
			});
			if (confirmSortOrderChange(loomState)) {
				doCommand(new RowInsertCommand(rowId, "below"));
			}
		},
		[doCommand, loomState]
	);

	const handleRowReorder = React.useCallback(
		(dragId: string, targetId: string) => {
			Logger.trace("handleRowReorder", {
				dragId,
				targetId,
			});
			doCommand(new RowReorderCommand(dragId, targetId));
		},
		[doCommand]
	);

	return {
		onRowAddClick: handleNewRowClick,
		onRowDeleteClick: handleRowDeleteClick,
		onRowInsertAboveClick: handleRowInsertAboveClick,
		onRowInsertBelowClick: handleRowInsertBelowClick,
		onRowReorder: handleRowReorder,
	};
};
