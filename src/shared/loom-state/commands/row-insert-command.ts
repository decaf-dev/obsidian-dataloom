import RowNotFoundError from "src/shared/error/row-not-found-error";
import {
	createCellForType,
	createRow,
} from "src/shared/loom-state/loom-state-factory";
import { type LoomState, SortDir } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export type RowInsert = "above" | "below";

export default class RowInsertCommand extends LoomStateCommand {
	/**
	 * The id of the row to reference when inserting a new row
	 */
	private rowId: string;

	/**
	 * Whether to insert the row above or below the reference row
	 */
	private insert: RowInsert;

	constructor(rowId: string, insert: RowInsert) {
		super(false);
		this.rowId = rowId;
		this.insert = insert;
	}

	execute(prevState: LoomState): LoomState {
		const { rows, columns } = prevState.model;

		//Find the base row index
		const index = rows.findIndex((row) => row.id === this.rowId);
		if (index === -1) throw new RowNotFoundError(this.rowId);

		//Calculate the insertion index
		const insertIndex = this.insert === "above" ? index : index + 1;

		const cells = columns.map((column) => {
			const { id, type } = column;
			return createCellForType(id, type);
		});
		//Create the new row and cells to insert
		const createdRow = createRow(insertIndex, { cells });

		//Insert the new row
		const updatedRows = [
			...rows.slice(0, insertIndex),
			createdRow,
			...rows.slice(insertIndex),
			//Set the current index of all the values to their current positions
			//This will allow us to retain the order of sorted rows
		].map((row, i) => ({ ...row, index: i }));

		//Reset the sort
		const updatedColumns = columns.map((column) => {
			return {
				...column,
				sortDir: SortDir.NONE,
			};
		});

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				columns: updatedColumns,
				rows: updatedRows,
			},
		};
		this.finishExecute(prevState, nextState);
		return nextState;
	}
}
