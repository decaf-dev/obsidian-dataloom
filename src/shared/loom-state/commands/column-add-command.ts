import { Cell, Column, LoomState, Row } from "../types/loom-state";
import {
	createCell,
	createColumn,
} from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";
import CellNotFoundError from "src/shared/error/cell-not-found-error";

export default class ColumnAddCommand extends LoomStateCommand {
	private newColumn: Column;
	private addedCells: {
		rowId: string;
		cell: Cell;
	}[] = [];

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns, rows } = prevState.model;

		const newColumn = createColumn();
		this.newColumn = newColumn;

		const nextColumns = [...columns, newColumn];
		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const newCell = createCell(newColumn.id);
			this.addedCells.push({
				rowId: row.id,
				cell: newCell,
			});
			const nextCells = [...cells, newCell];
			return {
				...row,
				cells: nextCells,
			};
		});

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

		const { id } = this.newColumn;
		const nextColumns = columns.filter((column) => column.id !== id);
		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells = cells.filter((cell) => cell.columnId !== id);
			return {
				...row,
				cells: nextCells,
			};
		});

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

		const nextColumns = [...columns, this.newColumn];
		const nextRows = rows.map((row) => {
			const { cells } = row;
			const cell = this.addedCells.find((c) => c.rowId === row.id);
			if (!cell) throw new CellNotFoundError({ rowId: row.id });
			const nextCells = [...cells, cell.cell];
			return {
				...row,
				cells: nextCells,
			};
		});

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
