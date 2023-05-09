import { createBodyCell, createBodyRow } from "src/data/table-state-factory";
import { BodyCell, BodyRow, TableState } from "./types";
import { RowIdError } from "./table-error";
import TableStateCommand from "./table-state-command";

export class RowDeleteCommand implements TableStateCommand {
	rowId: string | undefined;
	last: boolean | undefined;

	deletedRow: BodyRow | undefined = undefined;
	deletedCells: BodyCell[] | undefined = undefined;

	constructor(options: { id?: string; last?: boolean }) {
		const { id, last } = options;
		if (id === undefined && last === undefined)
			throw new Error("Either id or last must be defined");
		this.rowId = id;
		this.last = last;
	}

	execute(prevState: TableState): TableState {
		const { bodyRows, bodyCells } = prevState.model;
		if (bodyRows.length === 0) return prevState;

		let id = this.rowId;
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

		const { bodyRows, bodyCells } = prevState.model;
		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: [...bodyRows, this.deletedRow],
				bodyCells: [...bodyCells, ...this.deletedCells],
			},
		};
	}
}

export class RowAddCommand implements TableStateCommand {
	addedRowId: string | undefined = undefined;

	execute(prevState: TableState): TableState {
		const { bodyRows, bodyCells, columns } = prevState.model;

		const newRow = createBodyRow(bodyRows.length);
		this.addedRowId = newRow.id;

		const newCells = columns.map((column) =>
			createBodyCell(column.id, newRow.id, column.type)
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: [...bodyCells, ...newCells],
				bodyRows: [...bodyRows, newRow],
			},
		};
	}

	undo(prevState: TableState): TableState {
		if (this.addedRowId === undefined)
			throw new Error("Execute must be called before undo is available");

		const { bodyRows, bodyCells } = prevState.model;
		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: bodyRows.filter((row) => row.id !== this.addedRowId),
				bodyCells: bodyCells.filter(
					(cell) => cell.rowId !== this.addedRowId
				),
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
