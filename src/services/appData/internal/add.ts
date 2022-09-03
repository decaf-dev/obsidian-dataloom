import { TableModel, Tag } from "../state/types";
import { initialHeader, initialRow } from "../state/initialState";
import { CONTENT_TYPE } from "src/constants";
import { findNewCell } from "../external/loadUtils";
import { v4 as uuid } from "uuid";

export const addRow = (data: TableModel): TableModel => {
	const rowId = uuid();
	const tags: Tag[] = [];
	const cells = data.headers.map((header, i) => {
		return findNewCell(uuid(), rowId, header.id, header.type);
	});
	return {
		...data,
		rows: [...data.rows, initialRow(rowId, data.rows.length, Date.now())],
		cells: [...data.cells, ...cells],
		tags: [...data.tags, ...tags],
	};
};

export const addColumn = (data: TableModel): TableModel => {
	const header = initialHeader(uuid(), "New Column");
	const cells = [...data.cells];
	data.rows.forEach((row) => {
		cells.push(findNewCell(uuid(), row.id, header.id, CONTENT_TYPE.TEXT));
	});
	return {
		...data,
		headers: [...data.headers, header],
		cells,
	};
};
