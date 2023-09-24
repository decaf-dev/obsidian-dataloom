import { Row, LoomState } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import LoomStateCommand from "./loom-state-command";
import CommandArgumentsError from "./command-arguments-error";

export default class RowDeleteCommand extends LoomStateCommand {
	private rowId?: string;
	private last?: boolean;

	private deletedRow: {
		arrIndex: number;
		row: Row;
	};

	private previousRows: {
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

		const { rows } = prevState.model;

		//If there are no rows to delete, return the previous state
		if (rows.length === 0) return prevState;

		let id = this.rowId;
		if (this.last) id = rows[rows.length - 1].id;

		//Find the row to delete
		const rowToDelete = rows.find((row) => row.id === id);
		if (!rowToDelete) throw new RowNotFoundError(id);

		//Cache the row to delete
		this.deletedRow = {
			arrIndex: rows.indexOf(rowToDelete),
			row: structuredClone(rowToDelete),
		};

		//Get a new array of body rows, filtering the row we want to delete
		let newRows: Row[] = rows.filter((row) => row.id !== id);

		//Cache the indexes of the rows that were updated
		this.previousRows = newRows
			.filter((row) => row.index > this.deletedRow.row.index)
			.map((row) => {
				return {
					id: row.id,
					index: row.index,
				};
			});

		//Decrement the index of rows that were in a higher position than the deleted row
		//This is to avoid having duplicate indexes
		newRows = newRows.map((row) => {
			if (row.index > this.deletedRow.row.index) {
				return {
					...row,
					index: row.index - 1,
				};
			}
			return row;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: newRows,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { rows } = prevState.model;

		//Restore the row indexes
		const nextRows: Row[] = [...rows].map((row) => {
			const wasUpdated = this.previousRows.find((r) => r.id === row.id);
			if (wasUpdated) {
				return {
					...row,
					index: wasUpdated.index,
				};
			}
			return row;
		});

		//Restore the deleted row
		nextRows.splice(this.deletedRow.arrIndex, 0, this.deletedRow.row);

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}
}
