import { randomCellId, randomColumnId, randomRowId } from "../random";
import {
	DEFAULT_COLUMN_SETTINGS,
	TableState,
	ColumnSettings,
} from "../table/types";

const tableHeaderRow = (numColumns: number) => {
	let row = "|";
	row += " ";

	for (let i = 0; i < numColumns; i++) {
		row += " ";
		row += `column-${i}`;
		row += " ";
		row += "|";
	}
	return row;
};

const tableHyphenRow = (numColumns: number) => {
	let row = "|";
	row += " ";

	for (let i = 0; i < numColumns; i++) {
		row += " ";
		row += "---";
		row += " ";
		row += "|";
	}
	return row;
};

const tableRow = (numColumns: number) => {
	let row = "|";
	row += " ";

	for (let i = 0; i < numColumns; i++) {
		row += " ";
		row += `cell-${i}`;
		row += " ";
		row += "|";
	}
	return row;
};

const tableIdRow = (numColumns: number, tableId: string) => {
	let row = "|";
	row += " ";

	for (let i = 0; i < numColumns; i++) {
		row += " ";
		if (i === 0) row += tableId;
		row += " ";
		row += "|";
	}
	return row;
};

export const mockMarkdownTable = (
	numColumns: number,
	numDataRows: number,
	tableId: string
): string => {
	let table = "";
	table += tableHeaderRow(numColumns) + "\n";
	table += tableHyphenRow(numColumns);
	table += "\n";
	if (numDataRows !== 0) {
		for (let i = 0; i < numDataRows; i++) {
			table += tableRow(numColumns);
			table += "\n";
		}
	}
	table += tableIdRow(numColumns, tableId);
	return table;
};

export const mockSettings = (numColumns: number) => {
	const columns: { [x: string]: ColumnSettings } = {};
	for (let i = 0; i < numColumns; i++) {
		columns[i] = DEFAULT_COLUMN_SETTINGS;
	}
	return {
		columns,
	};
};

export const mockTableState = (
	numColumns: number,
	numRows: number
): TableState => {
	const rows = [];
	for (let i = 0; i < numRows; i++) rows.push(randomRowId());

	const columns = [];
	for (let i = 0; i < numColumns; i++) columns.push(randomColumnId());

	const cells = [];
	for (let y = 0; y < numRows; y++) {
		for (let x = 0; x < numColumns; x++) {
			cells.push({
				id: randomCellId(),
				columnId: columns[x],
				rowId: rows[y],
				markdown: "",
				html: "",
				isHeader: y === 0,
			});
		}
	}
	const columnSettings = Object.fromEntries(
		columns.map((id) => {
			return [id, DEFAULT_COLUMN_SETTINGS];
		})
	);
	return {
		model: {
			rows,
			columns,
			cells,
		},
		cacheVersion: 1,
		settings: {
			columns: columnSettings,
		},
	};
};
