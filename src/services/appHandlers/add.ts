import {
	DEFAULT_COLUMN_SETTINGS,
	TableModel,
	TableSettings,
	Cell,
} from "../table/types";

import { initialCell } from "../io/utils";
import { randomCellId, randomColumnId, randomRowId } from "../random";

export const addRow = (model: TableModel): TableModel => {
	const { rows, columns, cells } = model;

	const rowId = randomRowId();
	const arr = [...cells];
	for (let i = 0; i < columns.length; i++) {
		arr.push(initialCell(randomCellId(), columns[i], rowId, "", ""));
	}
	return {
		...model,
		cells: arr,
		rows: [...rows, rowId],
	};
};

export const addColumn = (
	model: TableModel,
	settings: TableSettings
): [TableModel, TableSettings] => {
	const { cells, columns, rows } = model;

	const columnId = randomColumnId();
	const columnArr = [...columns];
	columnArr.push(columnId);

	const cellArr: Cell[] = [];
	let rowIndex = 0;
	cells.forEach((cell, i) => {
		cellArr.push(cell);
		//Every columns length, add a new cell
		if ((i + 1) % columns.length === 0) {
			let markdown = "";
			let html = "";
			if (rowIndex === 0) {
				markdown = "New Column";
				html = "New Column";
			}
			cellArr.push(
				initialCell(
					randomCellId(),
					columnId,
					rows[rowIndex],
					markdown,
					html
				)
			);
			rowIndex++;
		}
	});

	const settingsObj = { ...settings };
	settingsObj.columns[columnId] = DEFAULT_COLUMN_SETTINGS;
	return [
		{
			...model,
			columns: columnArr,
			cells: cellArr,
		},
		settingsObj,
	];
};
