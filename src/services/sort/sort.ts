import { SortDir } from "./types";
import { ColumnSettings, TableModel, TableState } from "../table/types";
import { sortCells } from "../table/utils";

export const sortRows = (prevState: TableState): TableModel => {
	let headerSettings: ColumnSettings | null = null;
	let columnId = "";

	const { settings, model } = prevState;

	for (let i = 0; i < model.columnIds.length; i++) {
		const cId = model.columnIds[i];
		if (settings.columns[cId].sortDir !== SortDir.NONE) {
			headerSettings = settings.columns[cId];
			columnId = cId;
		}
	}

	if (!headerSettings) return model;

	const updatedRows = [...model.rowIds];
	const { sortDir } = headerSettings;

	updatedRows.sort((a, b) => {
		const cellA = model.cells.find(
			(c) => c.columnId === columnId && c.rowId === a
		);
		const cellB = model.cells.find(
			(c) => c.columnId === columnId && c.rowId === b
		);

		const markdownA = cellA.markdown;
		const markdownB = cellB.markdown;

		//Force empty cells to the bottom
		if (cellA.isHeader) return -1;
		if (cellB.isHeader) return 1;
		if (markdownA === "" && markdownB !== "") return 1;
		if (markdownA !== "" && markdownB === "") return -1;
		if (markdownA === "" && markdownB === "") return 0;

		if (sortDir === SortDir.ASC) {
			return markdownA.localeCompare(markdownB);
		} else if (sortDir === SortDir.DESC) {
			return markdownB.localeCompare(markdownA);
		}
	});

	return {
		rowIds: updatedRows,
		columnIds: model.columnIds,
		cells: sortCells(updatedRows, model.columnIds, model.cells),
	};
};
