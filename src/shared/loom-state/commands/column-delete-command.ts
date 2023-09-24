import ColumNotFoundError from "src/shared/error/column-not-found-error";
import { Column, LoomState, Cell, Filter, Row } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";
import CommandArgumentsError from "./command-arguments-error";
import CellNotFoundError from "src/shared/error/cell-not-found-error";

export default class ColumnDeleteCommand extends LoomStateCommand {
	private columnId?: string;
	private last?: boolean;

	private deletedColumn: { arrIndex: number; column: Column };
	private deletedCells: { rowId: string; arrIndex: number; cell: Cell }[] =
		[];
	private deletedFilters: { arrIndex: number; filter: Filter }[];

	constructor(options: { id?: string; last?: boolean }) {
		super();
		const { id, last } = options;
		if (id === undefined && last === undefined)
			throw new CommandArgumentsError("delete");

		this.columnId = id;
		this.last = last;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns, rows, filters } = prevState.model;

		//Maintains at least 1 column in the table
		if (columns.length === 1) return prevState;

		let id = this.columnId;
		if (this.last) id = columns[columns.length - 1].id;

		const columnToDelete = columns.find((column) => column.id === id);
		if (!columnToDelete) throw new ColumNotFoundError(id);
		this.deletedColumn = {
			arrIndex: columns.indexOf(columnToDelete),
			column: structuredClone(columnToDelete),
		};

		const nextColumns = columns.filter((column) => column.id !== id);

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const cell = row.cells.find((cell) => cell.columnId === id);
			if (!cell)
				throw new CellNotFoundError({ columnId: id, rowId: row.id });

			this.deletedCells.push({
				rowId: row.id,
				cell: structuredClone(cell),
				arrIndex: row.cells.indexOf(cell),
			});

			const nextCells = cells.filter((cell) => cell.columnId !== id);
			return {
				...row,
				cells: nextCells,
			};
		});

		const filtersToDelete = filters.filter(
			(filter) => filter.columnId === id
		);
		this.deletedFilters = filtersToDelete.map((filter) => ({
			arrIndex: filters.indexOf(filter),
			filter: structuredClone(filter),
		}));

		const nextFilters = filters.filter((filter) => filter.columnId !== id);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
				filters: nextFilters,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns, rows, filters } = prevState.model;

		const nextColumns: Column[] = [...columns];
		nextColumns.splice(
			this.deletedColumn.arrIndex,
			0,
			this.deletedColumn.column
		);

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells = structuredClone(cells);
			const cellsToAdd = this.deletedCells.filter(
				(cell) => cell.rowId === row.id
			);
			cellsToAdd.forEach((cell) => {
				nextCells.splice(cell.arrIndex, 0, cell.cell);
			});
			return {
				...row,
				cells: nextCells,
			};
		});

		const nextFilters = [...filters];
		this.deletedFilters.forEach((filter) => {
			nextFilters.splice(filter.arrIndex, 0, filter.filter);
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
				filters: nextFilters,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}
}
