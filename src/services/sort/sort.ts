import { SortDir } from "./types";
import { Row, TableModel, TableSettings } from "../table/types";

export const sortRows = (model: TableModel, settings: TableSettings): Row[] => {
	let header = null;
	let headerSettings = null;

	for (let i = 0; i < model.headers.length; i++) {
		if (settings.columns[i].sortDir !== SortDir.NONE) {
			header = model.headers[i];
			headerSettings = settings.columns[i];
		}
	}
	if (!header) return model.rows;
	const arr = [...model.rows];
	const { id } = header;
	const { sortDir } = headerSettings;
	arr.sort((a, b) => {
		const cellA = model.cells.find(
			(cell) => cell.headerId === id && cell.rowId === a.id
		);
		const cellB = model.cells.find(
			(cell) => cell.headerId === id && cell.rowId === b.id
		);
		const contentA = cellA.content;
		const contentB = cellB.content;

		if (sortDir !== SortDir.NONE) {
			//Force empty cells to the bottom
			if (contentA === "" && contentB !== "") return 1;
			if (contentA !== "" && contentB === "") return -1;
			if (contentA === "" && contentB === "") return 0;
		}

		if (sortDir === SortDir.ASC) {
			return contentA.localeCompare(contentB);
		} else if (sortDir === SortDir.DESC) {
			return contentB.localeCompare(contentA);
		} else {
			return 0;
		}
	});
	return arr;
};
