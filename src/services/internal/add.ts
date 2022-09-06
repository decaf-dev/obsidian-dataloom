import {
	DEFAULT_COLUMN_SETTINGS,
	TableModel,
	TableSettings,
} from "../table/types";
import { initialCell, initialHeader, initialRow } from "../table/initialState";
import { v4 as uuid } from "uuid";

export const addRow = (model: TableModel): TableModel => {
	const rowId = uuid();
	const cells = model.headers.map((header, i) => {
		return initialCell(uuid(), header.id, rowId, "", "");
	});
	return {
		...model,
		rows: [...model.rows, initialRow(rowId)],
		cells: [...model.cells, ...cells],
	};
};

export const addColumn = (
	model: TableModel,
	settings: TableSettings
): [TableModel, TableSettings] => {
	const title = "New Column";
	const header = initialHeader(uuid(), title, title);
	const cells = [...model.cells];
	model.rows.forEach((row) => {
		cells.push(initialCell(uuid(), header.id, row.id, "", ""));
	});

	const settingsCopy = { ...settings };
	settingsCopy.columns[model.headers.length] = DEFAULT_COLUMN_SETTINGS;
	return [
		{
			...model,
			headers: [...model.headers, header],
			cells,
		},
		settingsCopy,
	];
};
