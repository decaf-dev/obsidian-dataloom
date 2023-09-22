import {
	createCell,
	createRow,
} from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";
import { Cell, Row, LoomState } from "../types/loom-state";

export default class RowAddCommand extends LoomStateCommand {
	private addedRow: Row;
	private addedCells: Cell[];

	constructor() {
		super(true);
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { rows, bodyCells, columns } = prevState.model;

		this.addedRow = createRow(rows.length);
		this.addedCells = columns.map((column) => {
			const { id, type } = column;
			return createCell(id, this.addedRow.id, {
				cellType: type,
			});
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: [...bodyCells, ...this.addedCells],
				rows: [...rows, this.addedRow],
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { rows, bodyCells } = prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: [...bodyCells, ...this.addedCells],
				rows: [...rows, this.addedRow],
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { rows, bodyCells } = prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: rows.filter((row) => row.id !== this.addedRow.id),
				bodyCells: bodyCells.filter(
					(cell) => cell.rowId !== this.addedRow.id
				),
			},
		};
	}
}
