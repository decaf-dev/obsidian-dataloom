import {
	createBodyCell,
	createBodyRow,
} from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "../loom-state-command";
import { BodyCell, BodyRow, LoomState } from "../types";
import RowNotFoundError from "src/shared/error/row-not-found-error";

export type RowInsert = "above" | "below";

export default class RowInsertCommand extends LoomStateCommand {
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
	 * The id of the row to reference when inserting a new row
	 */
	private rowId: string;

	/**
	 * Whether to insert the row above or below the reference row
	 */
	private insert: RowInsert;

	constructor(rowId: string, insert: RowInsert) {
		super(true);
		this.rowId = rowId;
		this.insert = insert;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { bodyRows, bodyCells, columns } = prevState.model;

		//Find the base row
		const row = bodyRows.find((row) => row.id === this.rowId);
		if (!row) throw new RowNotFoundError(this.rowId);
		const { index } = row;

		//Find the insertion index
		const insertIndex = this.insert === "above" ? index : index + 1;
		if (insertIndex < 0) throw new Error("Cannot insert above first row");
		if (insertIndex > bodyRows.length)
			throw new Error("Cannot insert below last row");

		//Create the new row and cells
		const newRow = createBodyRow(insertIndex);
		this.addedRow = newRow;

		const newBodyCells = columns.map((column) => {
			const { id, type } = column;
			return createBodyCell(id, newRow.id, {
				cellType: type,
			});
		});
		this.addedBodyCells = newBodyCells;

		//Update the indexes of the rows below the insertion index by 1
		const updatedRows = bodyRows.map((row) => {
			if (row.index >= insertIndex) {
				return {
					...row,
					index: row.index + 1,
				};
			}
			return row;
		});
		const newRows = [...updatedRows, newRow];
		const newCells = [...bodyCells, ...newBodyCells];

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: newRows,
				bodyCells: newCells,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { bodyRows, bodyCells } = prevState.model;

		//Increase the indexes of the rows below (higher index) the insertion index by 1
		const updatedRows = bodyRows.map((row) => {
			if (row.index >= this.addedRow.index) {
				return {
					...row,
					index: row.index + 1,
				};
			}
			return row;
		});

		//We use the already created row and cells
		//because the ID is unique. If any commands after this depend on the same id,
		//they will fail.
		const newRows = [...updatedRows, this.addedRow];
		const newCells = [...bodyCells, ...this.addedBodyCells];

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: newRows,
				bodyCells: newCells,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { bodyRows, bodyCells } = prevState.model;

		//Find the row that was added
		const row = bodyRows.find((row) => row.id === this.addedRow.id);
		if (!row) throw new RowNotFoundError(this.addedRow.id);

		//Decrement the indexes of the rows below (higher index) the insertion index by 1
		const { index } = row;
		const updatedRows = bodyRows.map((row) => {
			if (row.index > index) {
				return {
					...row,
					index: row.index - 1,
				};
			}
			return row;
		});

		//Remove the added row and cells
		const newBodyRows = updatedRows.filter(
			(row) => row.id !== this.addedRow.id
		);
		const newBodyCells = bodyCells.filter(
			(cell) => cell.rowId !== this.addedRow.id
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: newBodyRows,
				bodyCells: newBodyCells,
			},
		};
	}
}
