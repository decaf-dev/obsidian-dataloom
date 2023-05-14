import { createBodyCell, createBodyRow } from "src/data/table-state-factory";
import TableStateCommand from "../table-state/table-state-command";
import { BodyCell, BodyRow, TableState } from "../table-state/types";
import { CommandRedoError, CommandUndoError } from "./command-errors";

export default class RowAddCommand implements TableStateCommand {
	newRow?: BodyRow;
	newBodyCells?: BodyCell[];
	hasUndoBeenCalled: boolean = false;

	execute(prevState: TableState): TableState {
		const { bodyRows, bodyCells, columns } = prevState.model;

		const newRow = createBodyRow(bodyRows.length);
		this.newRow = newRow;

		const newCells = columns.map((column) =>
			createBodyCell(column.id, newRow.id, { cellType: column.type })
		);
		this.newBodyCells = newCells;

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: [...bodyCells, ...newCells],
				bodyRows: [...bodyRows, newRow],
			},
		};
	}

	redo(prevState: TableState): TableState {
		const newRow = this.newRow;
		const newBodyCells = this.newBodyCells;
		if (
			newRow === undefined ||
			newBodyCells === undefined ||
			this.hasUndoBeenCalled === false
		)
			throw new CommandRedoError();

		const { bodyRows, bodyCells } = prevState.model;

		this.hasUndoBeenCalled = false;

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: [...bodyCells, ...newBodyCells],
				bodyRows: [...bodyRows, newRow],
			},
		};
	}

	undo(prevState: TableState): TableState {
		const newRow = this.newRow;
		if (newRow === undefined) throw new CommandUndoError();

		const { bodyRows, bodyCells } = prevState.model;

		this.hasUndoBeenCalled = true;
		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: bodyRows.filter((row) => row.id !== newRow.id),
				bodyCells: bodyCells.filter((cell) => cell.rowId !== newRow.id),
			},
		};
	}
}
