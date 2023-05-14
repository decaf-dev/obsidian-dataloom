import { createBodyCell, createBodyRow } from "src/data/table-state-factory";
import TableStateCommand from "../table-state/table-state-command";
import { TableState } from "../table-state/types";
import { CommandUndoError } from "./command-errors";

export default class RowAddCommand implements TableStateCommand {
	newRowId?: string;

	execute(prevState: TableState): TableState {
		const { bodyRows, bodyCells, columns } = prevState.model;

		const newRow = createBodyRow(bodyRows.length);
		this.newRowId = newRow.id;

		const newCells = columns.map((column) =>
			createBodyCell(column.id, newRow.id, column.type)
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: [...bodyCells, ...newCells],
				bodyRows: [...bodyRows, newRow],
			},
		};
	}

	undo(prevState: TableState): TableState {
		if (this.newRowId === undefined) throw new CommandUndoError();

		const { bodyRows, bodyCells } = prevState.model;
		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: bodyRows.filter((row) => row.id !== this.newRowId),
				bodyCells: bodyCells.filter(
					(cell) => cell.rowId !== this.newRowId
				),
			},
		};
	}
}
