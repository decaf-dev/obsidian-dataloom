import { BodyCell, Column, LoomState } from "../types/loom-state";
import {
	createBodyCell,
	createColumn,
} from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";

export default class ColumnAddCommand extends LoomStateCommand {
	private addedColumn: Column;
	private addedBodyCells: BodyCell[];

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { bodyCells, columns, rows } = prevState.model;

		this.addedColumn = createColumn();

		this.addedBodyCells = rows.map((row) =>
			createBodyCell(this.addedColumn.id, row.id)
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: [...columns, this.addedColumn],
				bodyCells: [...bodyCells, ...this.addedBodyCells],
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { bodyCells, columns } = prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: [...columns, this.addedColumn],
				bodyCells: [...bodyCells, ...this.addedBodyCells],
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns, bodyCells } = prevState.model;

		const { id } = this.addedColumn;
		return {
			...prevState,
			model: {
				...prevState.model,
				columns: columns.filter((column) => column.id !== id),
				bodyCells: bodyCells.filter((cell) => cell.columnId !== id),
			},
		};
	}
}
