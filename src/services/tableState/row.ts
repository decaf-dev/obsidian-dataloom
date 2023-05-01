import { createBodyCell, createBodyRow } from "src/data/tableState";
import { BodyRow, TableState } from "../../data/types";

export const addRow = (prevState: TableState): TableState => {
	const { bodyRows, bodyCells, columns } = prevState.model;
	const newRow = createBodyRow(bodyRows.length);
	const cellsCopy = structuredClone(bodyCells);

	columns.forEach((column) => {
		const newCell = createBodyCell(column.id, newRow.id);
		cellsCopy.push(newCell);
	});

	return {
		...prevState,
		model: {
			...prevState.model,
			bodyCells: cellsCopy,
			bodyRows: [...bodyRows, newRow],
		},
	};
};

export const deleteRow = (prevState: TableState, rowId: string): TableState => {
	const { bodyCells, bodyRows } = prevState.model;
	return {
		...prevState,
		model: {
			...prevState.model,
			bodyRows: bodyRows.filter((row) => row.id !== rowId),
			bodyCells: bodyCells.filter((cell) => cell.rowId !== rowId),
		},
	};
};

export const updateLastEditedTime = (
	rows: BodyRow[],
	rowId: string
): BodyRow[] => {
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
