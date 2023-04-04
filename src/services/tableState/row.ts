import StateFactory from "./StateFactory";
import { Row, TableState } from "./types";

export const addRow = (prevState: TableState): TableState => {
	const newRow = StateFactory.createRow();
	const cellsCopy = [...prevState.model.cells];

	prevState.model.columns.forEach((column) => {
		const newCell = StateFactory.createCell(column.id, newRow.id, false);
		cellsCopy.push(newCell);
	});

	return {
		...prevState,
		model: {
			...prevState.model,
			cells: cellsCopy,
			rows: [...prevState.model.rows, newRow],
		},
	};
};

export const deleteRow = (prevState: TableState, rowId: string): TableState => {
	const { cells, rows } = prevState.model;
	return {
		...prevState,
		model: {
			...prevState.model,
			rows: rows.filter((row) => row.id !== rowId),
			cells: cells.filter((cell) => cell.rowId !== rowId),
		},
	};
};

export const updateLastEditedTime = (rows: Row[], rowId: string): Row[] => {
	return rows.map((row) => {
		if (row.id === rowId) {
			return {
				...row,
				lastEditedTime: Date.now(),
			};
		}
		return row;
	});
};
