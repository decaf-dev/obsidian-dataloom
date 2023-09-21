import {
	createBodyCell,
	createBodyRow,
} from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";
import { BodyCell, BodyRow, LoomState, SortDir } from "../types/loom-state";
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
	private addedRow: BodyRow;

	/**
	 * The cells that were added
	 * These are used for `redo` because a unique id is generated each time a cell is created.
	 * Without this, the cell ids in the `redo` state would be different than the cell ids in the `execute` state.
	 * This will cause subequent commands that reference these row ids to fail.
	 */
	private addedBodyCells: BodyCell[];

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

		const { bodyRows, bodyCells, columns } = prevState.model;

		//Find the base row index
		const index = bodyRows.findIndex((row) => row.id === this.rowId);
		if (index === -1) throw new RowNotFoundError(this.rowId);

		//Calculate the insertion index
		const insertIndex = this.insert === "above" ? index : index + 1;

		//Create the new row and cells to insert
		const createdRow = createBodyRow(insertIndex);
		this.addedRow = createdRow;

		const createdBodyCells = columns.map((column) => {
			const { id, type } = column;
			return createBodyCell(id, createdRow.id, {
				cellType: type,
			});
		});
		//Save the added cells so we can reference them in `redo`
		this.addedBodyCells = createdBodyCells;

		//Save the previous row order so we can reference it in `undo`
		this.originalRowOrder = bodyRows.map((row) => ({
			id: row.id,
			index: row.index,
		}));

		//Insert the new row
		const updatedRows = [
			...bodyRows.slice(0, insertIndex),
			createdRow,
			...bodyRows.slice(insertIndex),
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

		const updatedBodyCells = [...bodyCells, ...createdBodyCells];

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: updatedColumns,
				bodyRows: updatedRows,
				bodyCells: updatedBodyCells,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { bodyRows, bodyCells, columns } = prevState.model;

		//Insert the new row
		const insertIndex = this.addedRow.index;
		const updatedBodyRows = [
			...bodyRows.slice(0, insertIndex),
			this.addedRow,
			...bodyRows.slice(insertIndex),
		].map((row, i) => ({ ...row, index: i }));

		const updatedBodyCells = [...bodyCells, ...this.addedBodyCells];

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
				bodyRows: updatedBodyRows,
				bodyCells: updatedBodyCells,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { bodyRows, bodyCells, columns } = prevState.model;

		//Find the row that was added
		const row = bodyRows.find((row) => row.id === this.addedRow.id);
		if (!row) throw new RowNotFoundError(this.addedRow.id);

		const updatedBodyRows = bodyRows
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

		//Remove the added body cells
		const updatedBodyCells = bodyCells.filter(
			(cell) => cell.rowId !== this.addedRow.id
		);

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
				bodyRows: updatedBodyRows,
				bodyCells: updatedBodyCells,
			},
		};
	}
}
