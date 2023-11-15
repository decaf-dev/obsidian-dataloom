import LoomStateCommand from "./loom-state-command";
import { Cell, LoomState, Row } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import { cloneDeep } from "lodash";
import { getCurrentDateTime } from "src/shared/date/utils";

export default class CellBodyUpdateCommand extends LoomStateCommand {
	private id: string;
	private data: Partial<Cell>;
	private isPartial: boolean;

	private rowId: string;

	private prevCell: Cell;
	private nextCell: Cell;

	private previousEditedDateTime: string;
	private nextLastEditedDateTime: string;

	constructor(id: string, data: Partial<Cell>, isPartial = true) {
		super(true);
		this.id = id;
		this.data = data;
		this.isPartial = isPartial;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		//Set the rowId of the cell
		const { rows } = prevState.model;
		const row = rows.find((row) =>
			row.cells.find((cell) => cell.id === this.id)
		);
		if (!row) throw new RowNotFoundError();
		this.rowId = row.id;
		this.previousEditedDateTime = row.lastEditedDateTime;

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				if (cell.id === this.id) {
					this.prevCell = cloneDeep(cell);

					let newCell: Cell = this.data as Cell;
					if (this.isPartial)
						newCell = { ...cell, ...this.data } as Cell;
					this.nextCell = newCell;
					return newCell;
				}
				return cell;
			});

			if (row.id === this.rowId) {
				const newLastEditedDateTime = getCurrentDateTime();
				this.nextLastEditedDateTime = newLastEditedDateTime;
				return {
					...row,
					lastEditedDateTime: newLastEditedDateTime,
					cells: nextCells,
				};
			}
			return row;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { rows } = prevState.model;
		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				if (cell.id === this.id) {
					return this.prevCell;
				}
				return cell;
			});

			if (row.id === this.rowId) {
				return {
					...row,
					lastEditedDateTime: this.previousEditedDateTime,
					cells: nextCells,
				};
			}
			return row;
		});

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

		const { rows } = prevState.model;
		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				if (cell.id === this.id) {
					return this.nextCell;
				}
				return cell;
			});

			if (row.id === this.rowId) {
				return {
					...row,
					lastEditedDateTime: this.nextLastEditedDateTime,
					cells: nextCells,
				};
			}
			return row;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
			},
		};
	}
}
