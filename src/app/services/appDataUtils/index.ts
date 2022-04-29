import {
	AppData,
	Tag,
	initialCell,
	initialTag,
	initialRow,
	initialHeader,
} from "../state";
import { v4 as uuidv4 } from "uuid";
import { CELL_TYPE } from "src/app/constants";

export const addRow = (data: AppData): AppData => {
	const rowId = uuidv4();
	const tags: Tag[] = [];
	const cells = data.headers.map((header, i) => {
		const cellId = uuidv4();
		if (header.type === CELL_TYPE.TAG)
			tags.push(initialTag(header.id, cellId, "", ""));
		return initialCell(cellId, rowId, header.id, header.type, "");
	});
	return {
		...data,
		updateTime: Date.now(),
		rows: [...data.rows, initialRow(rowId, Date.now())],
		cells: [...data.cells, ...cells],
		tags: [...data.tags, ...tags],
	};
};

export const addColumn = (data: AppData): AppData => {
	const header = initialHeader(`Column ${data.headers.length}`);
	const cells = [...data.cells];
	data.rows.forEach((row) => {
		cells.push(
			initialCell(uuidv4(), row.id, header.id, CELL_TYPE.TEXT, "")
		);
	});
	return {
		...data,
		updateTime: Date.now(),
		headers: [...data.headers, header],
		cells,
	};
};
