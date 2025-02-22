import Logger from "js-logger";
import React from "react";
import ColumnAddCommand from "src/shared/loom-state/commands/column-add-command";
import ColumnDeleteCommand from "src/shared/loom-state/commands/column-delete-command";
import ColumnReorderCommand from "src/shared/loom-state/commands/column-reorder-command";
import ColumnTypeUpdateCommand from "src/shared/loom-state/commands/column-type-update-command";
import ColumnUpdateCommand from "src/shared/loom-state/commands/column-update-command";
import { CellType, type Column } from "src/shared/loom-state/types/loom-state";
import { useLoomState } from "../../../loom-state-provider";

export const useColumn = () => {
	const { doCommand } = useLoomState();

	const handleNewColumnClick = React.useCallback(() => {
		Logger.trace("handleNewColumnClick");
		doCommand(new ColumnAddCommand());
	}, [doCommand]);

	const handleColumnTypeChange = React.useCallback(
		(columnId: string, type: CellType) => {
			Logger.trace("handleColumnTypeChange", {
				columnId,
				type,
			});
			doCommand(new ColumnTypeUpdateCommand(columnId, type));
		},
		[doCommand]
	);

	const handleColumnChange = React.useCallback(
		(
			columnId: string,
			data: Partial<Column>,
			options?: {
				shouldSortRows?: boolean;
				shouldSaveFrontmatter?: boolean;
			}
		) => {
			Logger.trace("handleColumnChange", {
				columnId,
				data,
				options,
			});
			doCommand(new ColumnUpdateCommand(columnId, data, options));
		},
		[doCommand]
	);

	const handleColumnDeleteClick = React.useCallback(
		(columnId: string) => {
			Logger.trace("handleColumnDeleteClick", {
				columnId,
			});
			doCommand(new ColumnDeleteCommand({ id: columnId }));
		},
		[doCommand]
	);

	const handleColumnReorder = React.useCallback(
		(dragId: string, targetId: string) => {
			Logger.trace("handleColumnReorder", {
				dragId,
				targetId,
			});
			doCommand(new ColumnReorderCommand(dragId, targetId));
		},
		[doCommand]
	);

	return {
		onColumnAddClick: handleNewColumnClick,
		onColumnTypeChange: handleColumnTypeChange,
		onColumnDeleteClick: handleColumnDeleteClick,
		onColumnChange: handleColumnChange,
		onColumnReorder: handleColumnReorder,
	};
};
