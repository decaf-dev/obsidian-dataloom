import { createBodyCell, createBodyRow } from "src/data/table-state-factory";
import { BodyRow, TableState } from "./types";

export const addRow = (prevState: TableState): TableState => {
	const { bodyRows, bodyCells, columns } = prevState.model;
	const newRow = createBodyRow(bodyRows.length);
	const cellsCopy = structuredClone(bodyCells);

	columns.forEach((column) => {
		const newCell = createBodyCell(column.id, newRow.id, column.type);
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

export const deleteRow = (
	prevState: TableState,
	options: {
		id?: string;
		last?: boolean;
	}
): TableState => {
	const { id, last } = options;
	if (!id && !last) throw new Error("deleteRow: no id or last provided");

	if (last) {
		const { bodyRows } = prevState.model;
		const lastRow = bodyRows[bodyRows.length - 1];
		return deleteRow(prevState, { id: lastRow.id });
	}

	const { bodyCells, bodyRows } = prevState.model;
	return {
		...prevState,
		model: {
			...prevState.model,
			bodyRows: bodyRows.filter((row) => row.id !== id),
			bodyCells: bodyCells.filter((cell) => cell.rowId !== id),
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
