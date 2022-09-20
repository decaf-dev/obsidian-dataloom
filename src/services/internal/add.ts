import {
	DEFAULT_COLUMN_SETTINGS,
	TableModel,
	TableSettings,
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

	const cellArr = [...cells];

	for (let i = 0; i < rows.length; i++) {
		let markdown = "";
		let html = "";
		if (i === 0) {
			markdown = "New Column";
			html = "New Column";
		}

		cellArr.push(
			initialCell(randomCellId(), columnId, rows[i], markdown, html)
		);
	}

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
