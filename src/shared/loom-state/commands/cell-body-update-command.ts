import LoomStateCommand from "./loom-state-command";
import { Cell, LoomState, Row } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";

export default class CellBodyUpdateCommand extends LoomStateCommand {
	private id: string;
	private data: Partial<Cell>;
	private isPartial: boolean;

	private rowId: string;

	private prevCell: Cell;
	private nextCell: Cell;

	private previousEditedTime: number;
	private nextLastEditedTime: number;

	constructor(id: string, data: Partial<Cell>, isPartial = true) {
		super();
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
		this.previousEditedTime = row.lastEditedTime;

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				if (cell.id === this.id) {
					this.prevCell = structuredClone(cell);

					let newCell: Cell = this.data as Cell;
					if (this.isPartial)
						newCell = { ...cell, ...this.data } as Cell;
					this.nextCell = newCell;
					return newCell;
				}
				return cell;
			});

			if (row.id === this.rowId) {
				const newLastEditedTime = Date.now();
				this.nextLastEditedTime = newLastEditedTime;
				return {
					...row,
					lastEditedTime: newLastEditedTime,
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
					lastEditedTime: this.previousEditedTime,
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
					lastEditedTime: this.nextLastEditedTime,
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
