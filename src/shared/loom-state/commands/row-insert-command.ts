import {
	createCell,
	createRow,
} from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";
import { Row, LoomState, SortDir } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";

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

	/**
	 * The row that was added
	 * This is used for `redo` because a unique id is generated each time a row is created.
	 * Without this, the row id in the `redo` state would be different than the row id in the `execute` state.
	 * This will cause subequent commands that reference this row id to fail.
	 */
	private addedRow: Row;

	/**
	 *  The column sort before execution
	 */
	private originalRowOrder: {
		id: string;
		index: number;
	}[];

	/**
	 * The column sort before execution
	 */
	private originalColumnSort: {
		id: string;
		sortDir: SortDir;
	}[];

	constructor(rowId: string, insert: RowInsert) {
		super();
		this.rowId = rowId;
		this.insert = insert;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { rows, columns } = prevState.model;

		//Find the base row index
		const index = rows.findIndex((row) => row.id === this.rowId);
		if (index === -1) throw new RowNotFoundError(this.rowId);

		//Calculate the insertion index
		const insertIndex = this.insert === "above" ? index : index + 1;

		const cells = columns.map((column) => {
			const { id, type } = column;
			return createCell(id, {
				cellType: type,
			});
		});
		//Create the new row and cells to insert
		const createdRow = createRow(insertIndex, { cells });
		this.addedRow = createdRow;

		//Save the previous row order so we can reference it in `undo`
		this.originalRowOrder = rows.map((row) => ({
			id: row.id,
			index: row.index,
		}));

		//Insert the new row
		const updatedRows = [
			...rows.slice(0, insertIndex),
			createdRow,
			...rows.slice(insertIndex),
			//Set the current index of all the values to their current positions
			//This will allow us to retain the order of sorted rows
		].map((row, i) => ({ ...row, index: i }));

		//Save the previous column sort so we can reference it in `undo`
		this.originalColumnSort = columns.map((column) => ({
			id: column.id,
			sortDir: column.sortDir,
		}));

		//Reset the sort
		const updatedColumns = columns.map((column) => {
			return {
				...column,
				sortDir: SortDir.NONE,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: updatedColumns,
				rows: updatedRows,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { rows, columns } = prevState.model;

		//Find the row that was added
		const row = rows.find((row) => row.id === this.addedRow.id);
		if (!row) throw new RowNotFoundError(this.addedRow.id);

		const updatedRows = rows
			//Remove the added row
			.filter((row) => row.id !== this.addedRow.id)
			//Restore the original row order
			.map((row) => {
				const original = this.originalRowOrder.find(
					(r) => r.id === row.id
				);
				if (!original) throw new RowNotFoundError(row.id);
				const { index } = original;
				return {
					...row,
					index,
				};
			});

		//Restore the original column sort
		const updatedColumns = columns.map((column) => {
			const oldColumn = this.originalColumnSort.find(
				(c) => c.id === column.id
			);
			if (!oldColumn) throw new Error("Column not found");
			const { sortDir } = oldColumn;
			return {
				...column,
				sortDir,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: updatedColumns,
				rows: updatedRows,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { rows, columns } = prevState.model;

		//Insert the new row
		const insertIndex = this.addedRow.index;
		const updatedRows = [
			...rows.slice(0, insertIndex),
			this.addedRow,
			...rows.slice(insertIndex),
		].map((row, i) => ({ ...row, index: i }));

		//Reset the sort
		const updatedColumns = columns.map((column) => {
			return {
				...column,
				sortDir: SortDir.NONE,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: updatedColumns,
				rows: updatedRows,
			},
		};
	}
}
