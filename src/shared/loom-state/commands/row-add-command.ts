import {
	createCellForType,
	createRow,
} from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";
import { Row, LoomState } from "../types/loom-state";

export default class RowAddCommand extends LoomStateCommand {
	private addedRow: Row;

	constructor() {
		super(true);
	}

	execute(prevState: LoomState): LoomState {
		const { rows, columns } = prevState.model;

		const cells = columns.map((column) => {
			const { id, type } = column;
			return createCellForType(id, type);
		});
		this.addedRow = createRow(rows.length, { cells });

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				rows: [...rows, this.addedRow],
			},
		};
		this.finishExecute(prevState, nextState);
		return nextState;
	}
}
