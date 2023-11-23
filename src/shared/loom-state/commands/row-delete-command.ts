import { Row, LoomState } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import LoomStateCommand from "./loom-state-command";
import CommandArgumentsError from "./command-arguments-error";

export default class RowDeleteCommand extends LoomStateCommand {
	private rowId?: string;
	private last?: boolean;

	constructor(options: { id?: string; last?: boolean }) {
		super(false);
		const { id, last } = options;
		if (id === undefined && last === undefined)
			throw new CommandArgumentsError("delete");

		this.rowId = id;
		this.last = last;
	}

	execute(prevState: LoomState): LoomState {
		const { rows } = prevState.model;

		//If there are no rows to delete, return the previous state
		if (rows.length === 0) return prevState;

		let id = this.rowId;
		if (this.last) id = rows[rows.length - 1].id;

		//Find the row to delete
		const rowToDelete = rows.find((row) => row.id === id);
		if (!rowToDelete) throw new RowNotFoundError(id);

		//Get a new array of body rows, filtering the row we want to delete
		let newRows: Row[] = rows.filter((row) => row.id !== id);

		//Decrement the index of rows that were in a higher position than the deleted row
		//This is to avoid having duplicate indexes
		newRows = newRows.map((row) => {
			if (row.index > rows.indexOf(rowToDelete)) {
				return {
					...row,
					index: row.index - 1,
				};
			}
			return row;
		});

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				rows: newRows,
			},
		};
		this.onExecute(prevState, nextState);
		return nextState;
	}
}
