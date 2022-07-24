import { AppData } from "../state/appData";
import { initialHeader } from "../state/header";
import { initialRow } from "../state/row";
import { Tag } from "../state/tag";
import { CONTENT_TYPE } from "src/app/constants";
import { findNewCell } from "../external/loadUtils";
import { v4 as uuid } from "uuid";

export const addRow = (data: AppData): AppData => {
	const rowId = uuid();
	const tags: Tag[] = [];
	const cells = data.headers.map((header, i) => {
		return findNewCell(uuid(), rowId, header.id, header.type);
	});
	return {
		...data,
		rows: [...data.rows, initialRow(rowId, Date.now())],
		cells: [...data.cells, ...cells],
		tags: [...data.tags, ...tags],
	};
};

export const addColumn = (data: AppData): AppData => {
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
