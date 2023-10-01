import { CellType, Column, LoomState } from "../../types/loom-state";
import LoomStateCommand from "../loom-state-command";
import { columnAddExecute, columnAddRedo, columnAddUndo } from "./utils";
import { AddedCell } from "./types";

export default class ColumnAddCommand extends LoomStateCommand {
	private type?: CellType;

	private addedColumn: Column;
	private addedCells: AddedCell[];

	constructor(type?: CellType) {
		super();
		this.type = type;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns, rows } = prevState.model;

		const result = columnAddExecute(columns, rows, { type: this.type });
		const { nextColumns, nextRows, addedColumn, addedCells } = result;
		this.addedColumn = addedColumn;
		this.addedCells = addedCells;

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns, rows } = prevState.model;
		const result = columnAddUndo(columns, rows, this.addedColumn);
		const { nextColumns, nextRows } = result;

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { rows, columns } = prevState.model;
		const result = columnAddRedo(
			columns,
			rows,
			this.addedColumn,
			this.addedCells
		);
		const { nextColumns, nextRows } = result;
		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
			},
		};
	}
}
