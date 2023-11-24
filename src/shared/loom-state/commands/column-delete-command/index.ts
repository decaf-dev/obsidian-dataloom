import { LoomState } from "../../types/loom-state";
import LoomStateCommand from "../loom-state-command";
import CommandArgumentsError from "../error/command-arguments-error";
import { columnDeleteExecute } from "./utils";

export default class ColumnDeleteCommand extends LoomStateCommand {
	private columnId?: string;
	private last?: boolean;

	constructor(options: { id?: string; last?: boolean }) {
		super(false);
		const { id, last } = options;
		if (id === undefined && last === undefined)
			throw new CommandArgumentsError("delete");

		this.columnId = id;
		this.last = last;
	}

	execute(prevState: LoomState): LoomState {
		const { columns, rows, filters } = prevState.model;

		let id = this.columnId;
		if (this.last) id = columns[columns.length - 1].id;

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const result = columnDeleteExecute(columns, rows, filters, id!);
		if (result === null) {
			return prevState;
		}

		const { nextColumns, nextFilters, nextRows } = result;

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
				filters: nextFilters,
			},
		};
		this.finishExecute(prevState, nextState);
		return nextState;
	}
}
