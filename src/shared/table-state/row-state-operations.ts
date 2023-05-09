import { createBodyCell, createBodyRow } from "src/data/table-state-factory";
import { BodyCell, BodyRow, TableState } from "./types";
import { RowIdError } from "./table-error";
import TableStateCommand from "./table-state-command";

export class RowDeleteCommand implements TableStateCommand {
	id: string | undefined;
	last: boolean | undefined;

	deletedRow: BodyRow | undefined = undefined;
	deletedCells: BodyCell[] | undefined = undefined;

	constructor(options: { id?: string; last?: boolean }) {
		const { id, last } = options;
		if (id === undefined && last === undefined)
			throw new Error("Either id or last must be defined");
		this.id = id;
		this.last = last;
	}

	execute(prevState: TableState): TableState {
		const { bodyRows, bodyCells } = prevState.model;
		if (bodyRows.length === 0) return prevState;

		let id = this.id;
		if (this.last) {
			id = bodyRows[bodyRows.length - 1].id;
		}

		const rowToDelete = bodyRows.find((row) => row.id === id);
		if (!rowToDelete) throw new RowIdError(id!);

		const cellsToDelete = bodyCells.filter((cell) => cell.rowId === id);
		if (cellsToDelete.length === 0) throw new Error("No cells to delete");

		this.deletedRow = structuredClone(rowToDelete);
		this.deletedCells = structuredClone(cellsToDelete);

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: bodyRows.filter((row) => row.id !== id),
				bodyCells: bodyCells.filter((cell) => cell.rowId !== id),
			},
		};
	}

	undo(prevState: TableState): TableState {
		if (this.deletedRow === undefined || this.deletedCells === undefined)
			throw new Error("Execute must be called before undo is available");
		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: [...prevState.model.bodyRows, this.deletedRow],
				bodyCells: [...prevState.model.bodyCells, ...this.deletedCells],
			},
		};
	}
}

export const rowAdd = (prevState: TableState): TableState => {
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

export const rowDelete = (
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
		return rowDelete(prevState, { id: lastRow.id });
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

export const rowUpdateLastEditedTime = (
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
