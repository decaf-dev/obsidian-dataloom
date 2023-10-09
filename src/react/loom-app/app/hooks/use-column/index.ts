import { CellType, Column } from "src/shared/loom-state/types/loom-state";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "../../../loom-state-provider";
import ColumnAddCommand from "src/shared/loom-state/commands/column-add-command";
import ColumnDeleteCommand from "src/shared/loom-state/commands/column-delete-command";
import ColumnUpdateCommand from "src/shared/loom-state/commands/column-update-command";
import ColumnTypeUpdateCommand from "src/shared/loom-state/commands/column-type-update-command";

export const useColumn = () => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

	function handleNewColumnClick() {
		logger("handleNewColumnClick");
		doCommand(new ColumnAddCommand());
	}
	function handleColumnTypeChange(columnId: string, type: CellType) {
		logger("handleColumnTypeChange", {
			columnId,
			type,
		});
		doCommand(new ColumnTypeUpdateCommand(columnId, type));
	}

	function handleColumnChange(
		columnId: string,
		data: Partial<Column>,
		options?: { shouldSortRows: boolean }
	) {
		logger("handleColumnChange", {
			columnId,
			data,
		});
		doCommand(new ColumnUpdateCommand(columnId, data, options));
	}

	function handleColumnDeleteClick(columnId: string) {
		logger("handleColumnDeleteClick", {
			columnId,
		});
		doCommand(new ColumnDeleteCommand({ id: columnId }));
	}

	return {
		onColumnAddClick: handleNewColumnClick,
		onColumnTypeChange: handleColumnTypeChange,
		onColumnDeleteClick: handleColumnDeleteClick,
		onColumnChange: handleColumnChange,
	};
};
