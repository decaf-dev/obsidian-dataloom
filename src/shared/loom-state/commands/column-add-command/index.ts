import type { CellType, LoomState } from "../../types/loom-state";
import LoomStateCommand from "../loom-state-command";
import { columnAddExecute } from "./utils";

export default class ColumnAddCommand extends LoomStateCommand {
	private type?: CellType;

	constructor(type?: CellType) {
		super(false);
		this.type = type;
	}

	execute(prevState: LoomState): LoomState {
		const { columns, rows } = prevState.model;

		const result = columnAddExecute(columns, rows, { type: this.type });
		const { columns: nextColumns, rows: nextRows } = result;

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
			},
		};
		this.finishExecute(prevState, nextState);
		return nextState;
	}
}
