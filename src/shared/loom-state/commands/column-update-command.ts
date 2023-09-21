import ColumNotFoundError from "src/shared/error/column-not-found-error";
import LoomStateCommand from "./loom-state-command";
import { Column, LoomState } from "../types/loom-state";

export default class ColumnUpdateCommand extends LoomStateCommand {
	private columnId: string;
	private data: Partial<Column>;
	private isPartial: boolean;

	private prevColumn: Column;
	private nextColumn: Column;

	constructor(
		columnId: string,
		data: Partial<Column>,
		options?: {
			isPartial?: boolean;
			shouldSortRows?: boolean;
		}
	) {
		const { shouldSortRows = false, isPartial = true } = options || {};

		super(shouldSortRows);
		this.columnId = columnId;
		this.data = data;
		this.isPartial = isPartial;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns } = prevState.model;
		const column = columns.find((column) => column.id === this.columnId);
		if (!column) throw new ColumNotFoundError(this.columnId);

		const nextColumns = columns.map((column) => {
			if (column.id === this.columnId) {
				this.prevColumn = structuredClone(column);

				let newColumn: Column = this.data as Column;
				if (this.isPartial)
					newColumn = { ...column, ...this.data } as Column;
				this.nextColumn = newColumn;
				return newColumn;
			}
			return column;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns } = prevState.model;
		const nextColumns = columns.map((column) => {
			if (column.id === this.prevColumn.id) {
				return this.prevColumn;
			}
			return column;
		});
		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { columns } = prevState.model;
		const nextColumns = columns.map((column) => {
			if (column.id === this.columnId) {
				return this.nextColumn;
			}
			return column;
		});
		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
			},
		};
	}
}
