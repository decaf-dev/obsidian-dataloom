import { SortDir } from "./types";
import {
	ColumnSettings,
	TableModel,
	TableSettings,
	TableState,
	Cell,
} from "../tableState/types";
import { sortCells } from "../tableState/utils";

const sortByDir = (
	columnId: string,
	sortDir: SortDir,
	rowIds: string[],
	cells: Cell[]
) => {
	const rowsCopy = [...rowIds];
	rowsCopy.sort((a, b) => {
		const cellA = cells.find(
			(c) => c.columnId === columnId && c.rowId === a
		);
		const cellB = cells.find(
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
	return rowsCopy;
};

const sortByCreationDate = (settings: TableSettings, rowIds: string[]) => {
	const rowsCopy = [...rowIds];
	rowsCopy.sort((a, b) => {
		const rowSettingsA = settings.rows[a];
		const rowSettingsB = settings.rows[b];
		return rowSettingsA.creationDate - rowSettingsB.creationDate;
	});
	return rowsCopy;
};

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

	if (!headerSettings)
		return {
			...model,
			rowIds: sortByCreationDate(settings, model.rowIds),
		};

	const rowsCopy = [...model.rowIds];
	const { sortDir } = headerSettings;

	return {
		rowIds: sortByDir(columnId, sortDir, model.rowIds, model.cells),
		columnIds: model.columnIds,
		cells: sortCells(rowsCopy, model.columnIds, model.cells),
	};
};
