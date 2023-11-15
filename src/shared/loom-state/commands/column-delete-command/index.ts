import { LoomState } from "../../types/loom-state";
import LoomStateCommand from "../loom-state-command";
import CommandArgumentsError from "../command-arguments-error";
import { DeletedCell, DeletedColumn, DeletedFilter } from "./types";
import { columnDeleteExecute, columnDeleteUndo } from "./utils";

export default class ColumnDeleteCommand extends LoomStateCommand {
	private columnId?: string;
	private last?: boolean;

	private deletedColumn: DeletedColumn;
	private deletedCells: DeletedCell[] = [];
	private deletedFilters: DeletedFilter[];

	constructor(options: { id?: string; last?: boolean }) {
		super(false);
		const { id, last } = options;
		if (id === undefined && last === undefined)
			throw new CommandArgumentsError("delete");

		this.columnId = id;
		this.last = last;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns, rows, filters } = prevState.model;

		let id = this.columnId;
		if (this.last) id = columns[columns.length - 1].id;

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const result = columnDeleteExecute(columns, rows, filters, id!);
		if (result === null) {
			return prevState;
		}

		const {
			nextColumns,
			nextFilters,
			nextRows,
			deletedCells,
			deletedColumn,
			deletedFilters,
		} = result;
		this.deletedColumn = deletedColumn;
		this.deletedCells = deletedCells;
		this.deletedFilters = deletedFilters;

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
		const { nextColumns, nextFilters, nextRows } = columnDeleteUndo(
			columns,
			rows,
			filters,
			this.deletedColumn,
			this.deletedCells,
			this.deletedFilters
		);

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
