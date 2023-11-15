import { CellType, Column } from "src/shared/loom-state/types/loom-state";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "../../../loom-state-provider";
import ColumnAddCommand from "src/shared/loom-state/commands/column-add-command";
import ColumnDeleteCommand from "src/shared/loom-state/commands/column-delete-command";
import ColumnUpdateCommand from "src/shared/loom-state/commands/column-update-command";
import ColumnTypeUpdateCommand from "src/shared/loom-state/commands/column-type-update-command";
import ColumnReorderCommand from "src/shared/loom-state/commands/column-reorder-command";
import React from "react";

export const useColumn = () => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

	const handleNewColumnClick = React.useCallback(() => {
		logger("handleNewColumnClick");
		doCommand(new ColumnAddCommand());
	}, [doCommand, logger]);

	const handleColumnTypeChange = React.useCallback(
		(columnId: string, type: CellType) => {
			logger("handleColumnTypeChange", {
				columnId,
				type,
			});
			doCommand(new ColumnTypeUpdateCommand(columnId, type));
		},
		[doCommand, logger]
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
			logger("handleColumnChange", {
				columnId,
				data,
				options,
			});
			doCommand(new ColumnUpdateCommand(columnId, data, options));
		},
		[doCommand, logger]
	);

	const handleColumnDeleteClick = React.useCallback(
		(columnId: string) => {
			logger("handleColumnDeleteClick", {
				columnId,
			});
			doCommand(new ColumnDeleteCommand({ id: columnId }));
		},
		[doCommand, logger]
	);

	const handleColumnReorder = React.useCallback(
		(dragId: string, targetId: string) => {
			logger("handleColumnReorder", {
				dragId,
				targetId,
			});
			doCommand(new ColumnReorderCommand(dragId, targetId));
		},
		[doCommand, logger]
	);

	return {
		onColumnAddClick: handleNewColumnClick,
		onColumnTypeChange: handleColumnTypeChange,
		onColumnDeleteClick: handleColumnDeleteClick,
		onColumnChange: handleColumnChange,
		onColumnReorder: handleColumnReorder,
	};
};
