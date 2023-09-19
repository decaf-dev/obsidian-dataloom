import {
	createBodyCell,
	createBodyRow,
} from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";
import { BodyCell, BodyRow, LoomState } from "../types/loom-state";

export default class RowAddCommand extends LoomStateCommand {
	private addedRow: BodyRow;
	private addedBodyCells: BodyCell[];

	constructor() {
		super(true);
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { bodyRows, bodyCells, columns } = prevState.model;

		this.addedRow = createBodyRow(bodyRows.length);
		this.addedBodyCells = columns.map((column) => {
			const { id, type } = column;
			return createBodyCell(id, this.addedRow.id, {
				cellType: type,
			});
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: [...bodyCells, ...this.addedBodyCells],
				bodyRows: [...bodyRows, this.addedRow],
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { bodyRows, bodyCells } = prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: [...bodyCells, ...this.addedBodyCells],
				bodyRows: [...bodyRows, this.addedRow],
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { bodyRows, bodyCells } = prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: bodyRows.filter((row) => row.id !== this.addedRow.id),
				bodyCells: bodyCells.filter(
					(cell) => cell.rowId !== this.addedRow.id
				),
			},
		};
	}
}
