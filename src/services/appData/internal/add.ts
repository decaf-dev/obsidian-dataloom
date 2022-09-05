import { AppData, Tag } from "../state/types";
import { initialCell, initialHeader, initialRow } from "../state/initialState";
import { v4 as uuid } from "uuid";

export const addRow = (data: AppData): AppData => {
	const rowId = uuid();
	const tags: Tag[] = [];
	const cells = data.headers.map((header, i) => {
		return initialCell(uuid(), header.id, rowId, header.type, "", "");
	});
	return {
		...data,
		rows: [...data.rows, initialRow(rowId, Date.now())],
		cells: [...data.cells, ...cells],
		tags: [...data.tags, ...tags],
	};
};

export const addColumn = (data: AppData): AppData => {
	const title = "New Column";
	const header = initialHeader(uuid(), title, title);
	const cells = [...data.cells];
	data.rows.forEach((row) => {
		cells.push(initialCell(uuid(), header.id, row.id, header.type, "", ""));
	});
	return {
		...data,
		headers: [...data.headers, header],
		cells,
	};
};
