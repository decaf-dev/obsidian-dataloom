import { AppData } from "../state/appData";
import { initialHeader } from "../state/header";
import { initialRow } from "../state/row";
import { Tag } from "../state/tag";
import { CELL_TYPE } from "src/app/constants";
import { initialCell } from "../state/cell";
import { randomCellId, randomColumnId, randomRowId } from "../../random";

export const addRow = (data: AppData): AppData => {
	const rowId = randomRowId();
	const tags: Tag[] = [];
	const cells = data.headers.map((header, i) => {
		const cellId = randomCellId();
		return initialCell(cellId, rowId, header.id, header.type);
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
	const header = initialHeader(randomColumnId(), "New Column");
	const cells = [...data.cells];
	data.rows.forEach((row) => {
		cells.push(
			initialCell(randomCellId(), row.id, header.id, CELL_TYPE.TEXT)
		);
	});
	return {
		...data,
		updateTime: Date.now(),
		headers: [...data.headers, header],
		cells,
	};
};
