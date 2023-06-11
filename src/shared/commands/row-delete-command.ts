import { BodyCell, BodyRow, TableState } from "../types";
import { RowNotFoundError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import { DeleteCommandArgumentsError } from "./command-errors";

export default class RowDeleteCommand extends TableStateCommand {
	private rowId?: string;
	private last?: boolean;

	private deletedRow: {
		arrIndex: number;
		row: BodyRow;
	};
	private deletedCells: {
		arrIndex: number;
		cell: BodyCell;
	}[];

	constructor(options: { id?: string; last?: boolean }) {
		super();
		const { id, last } = options;
		if (id === undefined && last === undefined)
			throw new DeleteCommandArgumentsError();

		this.rowId = id;
		this.last = last;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { bodyRows, bodyCells } = prevState.model;
		if (bodyRows.length === 0) return prevState;

		let id = this.rowId;
		if (this.last) {
			id = bodyRows[bodyRows.length - 1].id;
		}

		const rowToDelete = bodyRows.find((row) => row.id === id);
		if (!rowToDelete) throw new RowNotFoundError(id);

		this.deletedRow = {
			arrIndex: bodyRows.indexOf(rowToDelete),
			row: structuredClone(rowToDelete),
		};

		const cellsToDelete = bodyCells.filter((cell) => cell.rowId === id);
		this.deletedCells = cellsToDelete.map((cell) => ({
			arrIndex: bodyCells.indexOf(cell),
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

	redo(prevState: TableState): TableState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

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
