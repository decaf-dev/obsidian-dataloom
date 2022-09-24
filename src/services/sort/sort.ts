import { SortDir } from "./types";
import {
	TableModel,
	TableSettings,
	Cell,
	ColumnSettings,
} from "../table/types";

// //TODO when you move columns, you need to change the settings
// export const sortRows = (
// 	model: TableModel,
// 	settings: TableSettings
// ): Cell[] => {
// 	let headerSettings: ColumnSettings | null = null;

// 	const { cells, numColumns } = model;

// 	for (let i = 0; i < numColumns; i++) {
// 		if (settings.columns[i].sortDir !== SortDir.NONE)
// 			headerSettings = settings.columns[i];
// 	}

// 	if (!headerSettings) return cells;

// 	const
// 	for (let i = 0; i < cells.length; i++){

// 	}
// 	const arr = model.cells;
// 	const { sortDir } = headerSettings;

// 	arr.sort((a, b) => {
// 		const cellA = model.cells.find(
// 			(cell) => cell.headerId === id && cell.rowId === a.id
// 		);
// 		const cellB = model.cells.find(
// 			(cell) => cell.headerId === id && cell.rowId === b.id
// 		);
// 		const contentA = cellA.content;
// 		const contentB = cellB.content;

// 		if (sortDir !== SortDir.NONE) {
// 			//Force empty cells to the bottom
// 			if (contentA === "" && contentB !== "") return 1;
// 			if (contentA !== "" && contentB === "") return -1;
// 			if (contentA === "" && contentB === "") return 0;
// 		}

// 		if (sortDir === SortDir.ASC) {
// 			return contentA.localeCompare(contentB);
// 		} else if (sortDir === SortDir.DESC) {
// 			return contentB.localeCompare(contentA);
// 		} else {
// 			return 0;
// 		}
// 	});
// 	return arr;
// };
