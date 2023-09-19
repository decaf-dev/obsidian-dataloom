import ColumNotFoundError from "src/shared/error/column-not-found-error";
import {
	Column,
	LoomState,
	HeaderCell,
	BodyCell,
	FooterCell,
	Filter,
} from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";
import CommandArgumentsError from "./command-arguments-error";

export default class ColumnDeleteCommand extends LoomStateCommand {
	private columnId?: string;
	private last?: boolean;

	private deletedColumn: { arrIndex: number; column: Column };
	private deletedHeaderCells: { arrIndex: number; cell: HeaderCell }[];
	private deletedBodyCells: { arrIndex: number; cell: BodyCell }[];
	private deletedFooterCells: { arrIndex: number; cell: FooterCell }[];
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

		const { columns, headerCells, bodyCells, footerCells, filters } =
			prevState.model;

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

		const headerCellsToDelete = headerCells.filter(
			(cell) => cell.columnId === id
		);
		this.deletedHeaderCells = headerCellsToDelete.map((cell) => ({
			arrIndex: headerCells.indexOf(cell),
			cell: structuredClone(cell),
		}));

		const bodyCellsToDelete = bodyCells.filter(
			(cell) => cell.columnId === id
		);
		this.deletedBodyCells = bodyCellsToDelete.map((cell) => ({
			arrIndex: bodyCells.indexOf(cell),
			cell: structuredClone(cell),
		}));

		const footerCellsToDelete = footerCells.filter(
			(cell) => cell.columnId === id
		);
		this.deletedFooterCells = footerCellsToDelete.map((cell) => ({
			arrIndex: footerCells.indexOf(cell),
			cell: structuredClone(cell),
		}));

		const filtersToDelete = filters.filter(
			(filter) => filter.columnId === id
		);
		this.deletedFilters = filtersToDelete.map((filter) => ({
			arrIndex: filters.indexOf(filter),
			filter: structuredClone(filter),
		}));

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: columns.filter((column) => column.id !== id),
				headerCells: headerCells.filter((cell) => cell.columnId !== id),
				bodyCells: bodyCells.filter((cell) => cell.columnId !== id),
				footerCells: footerCells.filter((cell) => cell.columnId !== id),
				filters: filters.filter((filter) => filter.columnId !== id),
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns, headerCells, bodyCells, footerCells, filters } =
			prevState.model;

		const updatedColumns = [...columns];
		updatedColumns.splice(
			this.deletedColumn.arrIndex,
			0,
			this.deletedColumn.column
		);

		const updatedHeaderCells = [...headerCells];
		this.deletedHeaderCells.forEach((cell) => {
			updatedHeaderCells.splice(cell.arrIndex, 0, cell.cell);
		});

		const updatedBodyCells = [...bodyCells];
		this.deletedBodyCells.forEach((cell) => {
			updatedBodyCells.splice(cell.arrIndex, 0, cell.cell);
		});

		const updatedFooterCells = [...footerCells];
		this.deletedFooterCells.forEach((cell) => {
			updatedFooterCells.splice(cell.arrIndex, 0, cell.cell);
		});

		const updatedFilters = [...filters];
		this.deletedFilters.forEach((filter) => {
			updatedFilters.splice(filter.arrIndex, 0, filter.filter);
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: updatedColumns,
				headerCells: updatedHeaderCells,
				bodyCells: updatedBodyCells,
				footerCells: updatedFooterCells,
				filters: updatedFilters,
			},
		};
	}
}
