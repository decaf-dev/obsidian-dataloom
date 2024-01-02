import { useLoomState } from "../../loom-state-provider";
import RowAddCommand from "src/shared/loom-state/commands/row-add-command";
import RowDeleteCommand from "src/shared/loom-state/commands/row-delete-command";
import React from "react";
import RowInsertCommand from "src/shared/loom-state/commands/row-insert-command";
import { confirmSortOrderChange } from "src/shared/sort-utils";
import RowReorderCommand from "src/shared/loom-state/commands/row-reorder-command";

export const useRow = () => {
	const { doCommand, loomState } = useLoomState();

	const handleRowDeleteClick = React.useCallback(
		(rowId: string) => {
			logger("handleRowDeleteClick", {
				rowId,
			});
			doCommand(new RowDeleteCommand({ id: rowId }));
		},
		[doCommand, logger]
	);

	const handleNewRowClick = React.useCallback(() => {
		logger("handleNewRowClick");
		doCommand(new RowAddCommand());
	}, [doCommand, logger]);

	const handleRowInsertAboveClick = React.useCallback(
		(rowId: string) => {
			logger("handleRowInsertAboveClick", {
				rowId,
			});
			if (confirmSortOrderChange(loomState)) {
				doCommand(new RowInsertCommand(rowId, "above"));
			}
		},
		[doCommand, logger, loomState]
	);

	const handleRowInsertBelowClick = React.useCallback(
		(rowId: string) => {
			logger("handleRowInsertBelowClick", {
				rowId,
			});
			if (confirmSortOrderChange(loomState)) {
				doCommand(new RowInsertCommand(rowId, "below"));
			}
		},
		[doCommand, logger, loomState]
	);

	const handleRowReorder = React.useCallback(
		(dragId: string, targetId: string) => {
			logger("handleRowReorder", {
				dragId,
				targetId,
			});
			doCommand(new RowReorderCommand(dragId, targetId));
		},
		[doCommand, logger]
	);

	return {
		onRowAddClick: handleNewRowClick,
		onRowDeleteClick: handleRowDeleteClick,
		onRowInsertAboveClick: handleRowInsertAboveClick,
		onRowInsertBelowClick: handleRowInsertBelowClick,
		onRowReorder: handleRowReorder,
	};
};
