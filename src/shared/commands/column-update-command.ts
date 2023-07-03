import { ColumNotFoundError } from "../dashboard-state/dashboard-error";
import DashboardStateCommand from "../dashboard-state/table-state-command";
import { Column, DashboardState } from "../types";

export default class ColumnUpdateCommand extends DashboardStateCommand {
	private columnId: string;
	private key: keyof Column;
	private value?: unknown;

	private previousValue: unknown;

	constructor(
		columnId: string,
		key: keyof Column,
		options?: {
			shouldSortRows?: boolean;
			value?: unknown;
		}
	) {
		const { shouldSortRows = false, value } = options || {};

		super(shouldSortRows);
		this.columnId = columnId;
		this.key = key;
		this.value = value;
	}

	execute(prevState: DashboardState): DashboardState {
		super.onExecute();

		const { columns } = prevState.model;
		const column = columns.find((column) => column.id === this.columnId);
		if (!column) throw new ColumNotFoundError(this.columnId);

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

					if (column.id === this.columnId) {
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

	redo(prevState: DashboardState): DashboardState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: DashboardState): DashboardState {
		super.onUndo();

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: prevState.model.columns.map((column) => {
					if (column.id === this.columnId) {
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
