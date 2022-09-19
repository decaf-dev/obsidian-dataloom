import {
	DEFAULT_COLUMN_SETTINGS,
	TableModel,
	TableSettings,
} from "../table/types";
import { v4 as uuid } from "uuid";
import { Cell } from "../table/types";

export const addRow = (model: TableModel): TableModel => {
	const { numColumns, cells } = model;

	let arr = [];
	for (let i = 0; i < numColumns; i++) {
		arr.push({
			id: uuid(),
			textContent: "",
			content: "",
		});
	}
	return {
		...model,
		cells: [...cells, ...arr],
	};
};

//I want to be clear on all of my data tables

export const addColumn = (
	model: TableModel,
	settings: TableSettings
): [TableModel, TableSettings] => {
	const { cells, numColumns } = model;

	const arr = [...cells];
	interface InsertCell {
		cell: Cell;
		insertIndex: number;
	}

	const cellsToInsert: InsertCell[] = [];
	const numRows = cells.length / numColumns;
	for (let i = 0; i < numRows; i++) {
		let content = "";
		let textContent = "";
		if (i === 0) {
			content = "New Column";
			textContent = "New Column";
		}
		cellsToInsert.push({
			cell: {
				id: uuid(),
				textContent,
				content,
			},
			insertIndex: numColumns * (i + 1) + cellsToInsert.length,
		});
	}

	cellsToInsert.forEach((insertCell) => {
		const { cell, insertIndex } = insertCell;
		arr.splice(insertIndex, 0, cell);
	});

	const obj = { ...settings };
	obj.columns[numColumns] = DEFAULT_COLUMN_SETTINGS;
	return [
		{
			...model,
			numColumns: numColumns + 1,
			cells: arr,
		},
		obj,
	];
};
