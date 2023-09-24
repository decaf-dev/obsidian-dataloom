import {
	createCell,
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
		super.onExecute();

		const { rows, columns } = prevState.model;

		const cells = columns.map((column) => {
			const { id, type } = column;
			return createCell(id, {
				cellType: type,
			});
		});
		this.addedRow = createRow(rows.length, { cells });

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: [...rows, this.addedRow],
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { rows } = prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: rows.filter((row) => row.id !== this.addedRow.id),
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { rows } = prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: [...rows, this.addedRow],
			},
		};
	}
}
