import { BodyCell, BodyRow, TableState } from "../table-state/types";
import { RowIdError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import {
	DeleteCommandArgumentsError,
	CommandUndoError,
} from "./command-errors";

export default class RowDeleteCommand implements TableStateCommand {
	rowId?: string;
	last?: boolean;

	deletedRowIndex?: number;
	deletedRow?: {
		arrIndex: number;
		row: BodyRow;
	};
	deletedCells?: {
		arrIndex: number;
		cell: BodyCell;
	}[];

	constructor(options: { id?: string; last?: boolean }) {
		const { id, last } = options;
		if (id === undefined && last === undefined)
			throw new DeleteCommandArgumentsError();

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
		this.deletedRow = {
			arrIndex: bodyRows.findIndex((row) => row.id === id),
			row: structuredClone(rowToDelete),
		};

		const cellsToDelete = bodyCells.filter((cell) => cell.rowId === id);
		this.deletedCells = cellsToDelete.map((cell) => ({
			arrIndex: bodyCells.findIndex((c) => c.id === cell.id),
			cell: structuredClone(cell),
		}));

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
			throw new CommandUndoError();

		const { bodyRows, bodyCells } = prevState.model;

		const updatedBodyRows = [...bodyRows];
		updatedBodyRows.splice(
			this.deletedRow.arrIndex,
			0,
			this.deletedRow.row
		);

		const updatedBodyCells = [...bodyCells];
		this.deletedCells.forEach((cell) => {
			updatedBodyCells.splice(cell.arrIndex, 0, cell.cell);
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: updatedBodyRows,
				bodyCells: updatedBodyCells,
			},
		};
	}
}
