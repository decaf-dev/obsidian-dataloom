import { BodyCell, BodyRow, LoomState } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import LoomStateCommand from "./loom-state-command";
import CommandArgumentsError from "./command-arguments-error";

export default class RowDeleteCommand extends LoomStateCommand {
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

	private previousBodyRows: {
		id: string;
		index: number;
	}[];

	constructor(options: { id?: string; last?: boolean }) {
		super();
		const { id, last } = options;
		if (id === undefined && last === undefined)
			throw new CommandArgumentsError("delete");

		this.rowId = id;
		this.last = last;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { bodyRows, bodyCells } = prevState.model;

		//If there are no rows to delete, return the previous state
		if (bodyRows.length === 0) return prevState;

		let id = this.rowId;
		if (this.last) id = bodyRows[bodyRows.length - 1].id;

		//Find the row to delete
		const rowToDelete = bodyRows.find((row) => row.id === id);
		if (!rowToDelete) throw new RowNotFoundError(id);

		//Cache the row to delete
		this.deletedRow = {
			arrIndex: bodyRows.indexOf(rowToDelete),
			row: structuredClone(rowToDelete),
		};

		//Get a new array of body rows, filtering the row we want to delete
		let newBodyRows = bodyRows.filter((row) => row.id !== id);

		//Cache the indexes of the rows that were updated
		this.previousBodyRows = newBodyRows
			.filter((row) => row.index > this.deletedRow.row.index)
			.map((row) => {
				return {
					id: row.id,
					index: row.index,
				};
			});

		//Decrement the index of rows that were in a higher position than the deleted row
		//This is to avoid having duplicate indexes
		newBodyRows = newBodyRows.map((row) => {
			if (row.index > this.deletedRow.row.index) {
				return {
					...row,
					index: row.index - 1,
				};
			}
			return row;
		});

		//Cache the cells to delete
		const cellsToDelete = bodyCells.filter((cell) => cell.rowId === id);
		this.deletedCells = cellsToDelete.map((cell) => ({
			arrIndex: bodyCells.indexOf(cell),
			cell: structuredClone(cell),
		}));

		//Get a new array of body cells, filtering the cells we want to delete
		const newBodyCells = bodyCells.filter((cell) => cell.rowId !== id);

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: newBodyRows,
				bodyCells: newBodyCells,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { bodyRows, bodyCells } = prevState.model;

		//Restore the row indexes
		const updatedBodyRows = [...bodyRows].map((row) => {
			const wasUpdated = this.previousBodyRows.find(
				(r) => r.id === row.id
			);
			if (wasUpdated) {
				return {
					...row,
					index: wasUpdated.index,
				};
			}
			return row;
		});

		//Restore the deleted row
		updatedBodyRows.splice(
			this.deletedRow.arrIndex,
			0,
			this.deletedRow.row
		);

		//Restore the deleted row cells
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
