import { useLogger } from "../logger";
import { useTableState } from "./table-state-context";
import CellBodyUpdateCommand from "../commands/cell-body-update-command";
import CellHeaderUpdateCommand from "../commands/cell-header-update-command";

export const useCell = () => {
	const logger = useLogger();
	const { doCommand } = useTableState();

	function handleHeaderCellContentChange(cellId: string, value: string) {
		logger("handleCellContentChange", {
			cellId,
			markdown: value,
		});

		doCommand(new CellHeaderUpdateCommand(cellId, "markdown", value));
	}

	function handleBodyCellContentChange(
		cellId: string,
		rowId: string,
		value: string
	) {
		logger("handleCellContentChange", {
			cellId,
			rowId,
			markdown: value,
		});

		doCommand(new CellBodyUpdateCommand(cellId, rowId, "markdown", value));
	}

	function handleCellDateTimeChange(
		cellId: string,
		rowId: string,
		value: number | null
	) {
		logger("handleCellContentChange", {
			cellId,
			rowId,
			dateTime: value,
		});

		doCommand(new CellBodyUpdateCommand(cellId, rowId, "dateTime", value));
	}

	return {
		handleHeaderCellContentChange,
		handleBodyCellContentChange,
		handleCellDateTimeChange,
	};
};
