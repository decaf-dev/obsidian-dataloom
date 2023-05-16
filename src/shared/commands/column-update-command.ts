import { ColumnIdError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import { Column, TableState } from "../table-state/types";
import { CommandUndoError } from "./command-errors";

export default class ColumnUpdateCommand extends TableStateCommand {
	columnId: string;
	key: keyof Column;
	value?: unknown;

	previousValue: unknown;

	constructor(columnId: string, key: keyof Column, value?: unknown) {
		super();
		this.columnId = columnId;
		this.key = key;
		this.value = value;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { columns } = prevState.model;
		const column = columns.find((column) => column.id === this.columnId);
		if (!column) throw new ColumnIdError(this.columnId);

		this.previousValue = column[this.key];

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: prevState.model.columns.map((column) => {
					const isBoolean = typeof column[this.key] === "boolean";

					if (!isBoolean && this.value === undefined)
						throw new Error(
							"a value must be provided when the column expects a non-boolean value"
						);

					if (column.id == this.columnId) {
						return {
							...column,
							[this.key]: isBoolean
								? !column[this.key]
								: this.value,
						};
					}
					return column;
				}),
			},
		};
	}

	redo(prevState: TableState): TableState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: prevState.model.columns.map((column) => {
					if (column.id == this.columnId) {
						return {
							...column,
							[this.key]: this.previousValue,
						};
					}
					return column;
				}),
			},
		};
	}
}
