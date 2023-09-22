import { BodyCell, Column, HeaderCell, LoomState } from "../types/loom-state";
import {
	createBodyCell,
	createColumn,
	createHeaderCell,
} from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";

export default class ColumnAddCommand extends LoomStateCommand {
	private addedColumn: Column;
	private addedHeaderCells: HeaderCell[];
	private addedBodyCells: BodyCell[];

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { headerCells, bodyCells, columns, headerRows, bodyRows } =
			prevState.model;

		this.addedColumn = createColumn();

		this.addedHeaderCells = headerRows.map((row) =>
			createHeaderCell(this.addedColumn.id, row.id)
		);

		this.addedBodyCells = bodyRows.map((row) =>
			createBodyCell(this.addedColumn.id, row.id)
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: [...columns, this.addedColumn],
				headerCells: [...headerCells, ...this.addedHeaderCells],
				bodyCells: [...bodyCells, ...this.addedBodyCells],
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { headerCells, bodyCells, columns } = prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: [...columns, this.addedColumn],
				headerCells: [...headerCells, ...this.addedHeaderCells],
				bodyCells: [...bodyCells, ...this.addedBodyCells],
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns, headerCells, bodyCells } = prevState.model;

		const { id } = this.addedColumn;
		return {
			...prevState,
			model: {
				...prevState.model,
				columns: columns.filter((column) => column.id !== id),
				headerCells: headerCells.filter((cell) => cell.columnId !== id),
				bodyCells: bodyCells.filter((cell) => cell.columnId !== id),
			},
		};
	}
}
