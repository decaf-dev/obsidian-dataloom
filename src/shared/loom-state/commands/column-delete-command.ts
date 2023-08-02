import ColumNotFoundError from "src/shared/error/column-not-found-error";
import {
	Column,
	LoomState,
	HeaderCell,
	BodyCell,
	FooterCell,
	FilterRule,
} from "../types";
import LoomStateCommand from "../loom-state-command";
import { DeleteCommandArgumentsError } from "./command-errors";

export default class ColumnDeleteCommand extends LoomStateCommand {
	private columnId?: string;
	private last?: boolean;

	private deletedColumn: { arrIndex: number; column: Column };
	private deletedHeaderCells: { arrIndex: number; cell: HeaderCell }[];
	private deletedBodyCells: { arrIndex: number; cell: BodyCell }[];
	private deletedFooterCells: { arrIndex: number; cell: FooterCell }[];
	private deletedFilterRules: { arrIndex: number; rule: FilterRule }[];

	constructor(options: { id?: string; last?: boolean }) {
		super();
		const { id, last } = options;
		if (id === undefined && last === undefined)
			throw new DeleteCommandArgumentsError();

		this.columnId = id;
		this.last = last;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns, headerCells, bodyCells, footerCells, filterRules } =
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

		const rulesToDelete = filterRules.filter(
			(rule) => rule.columnId === id
		);
		this.deletedFilterRules = rulesToDelete.map((rule) => ({
			arrIndex: filterRules.indexOf(rule),
			rule: structuredClone(rule),
		}));

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: columns.filter((column) => column.id !== id),
				headerCells: headerCells.filter((cell) => cell.columnId !== id),
				bodyCells: bodyCells.filter((cell) => cell.columnId !== id),
				footerCells: footerCells.filter((cell) => cell.columnId !== id),
				filterRules: filterRules.filter((rule) => rule.columnId !== id),
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns, headerCells, bodyCells, footerCells, filterRules } =
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

		const updatedFilterRules = [...filterRules];
		this.deletedFilterRules.forEach((rule) => {
			updatedFilterRules.splice(rule.arrIndex, 0, rule.rule);
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: updatedColumns,
				headerCells: updatedHeaderCells,
				bodyCells: updatedBodyCells,
				footerCells: updatedFooterCells,
				filterRules: updatedFilterRules,
			},
		};
	}
}
