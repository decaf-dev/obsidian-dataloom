import {
	DEFAULT_COLUMN_SETTINGS,
	TableModel,
	TableSettings,
} from "../table/types";
import { v4 as uuid } from "uuid";

import { initialCell } from "../io/utils";

export const addRow = (model: TableModel): TableModel => {
	const { rows, columns, cells } = model;

	const rowId = uuid();
	const arr = [...cells];
	for (let i = 0; i < columns.length; i++) {
		arr.push(initialCell(uuid(), columns[i], rowId, "", ""));
	}
	return {
		...model,
		cells: arr,
		rows: [...rows, rowId],
	};
};

//I want to be clear on all of my data tables

export const addColumn = (
	model: TableModel,
	settings: TableSettings
): [TableModel, TableSettings] => {
	const { cells, columns, rows } = model;

	const columnId = uuid();
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

		cellArr.push(initialCell(uuid(), columnId, rows[i], markdown, html));
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
