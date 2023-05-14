import { TableState } from "../table-state/types";
import {
	createBodyCell,
	createColumn,
	createFooterCell,
	createHeaderCell,
} from "src/data/table-state-factory";
import TableStateCommand from "../table-state/table-state-command";
import { CommandUndoError } from "./command-errors";

export default class ColumnAddCommand implements TableStateCommand {
	newColumnId: string | undefined = undefined;

	execute(prevState: TableState): TableState {
		const {
			headerCells,
			bodyCells,
			footerCells,
			columns,
			headerRows,
			bodyRows,
			footerRows,
		} = prevState.model;

		//Add column
		const newColumn = createColumn();
		this.newColumnId = newColumn.id;

		const newHeaderCells = headerRows.map((row) =>
			createHeaderCell(newColumn.id, row.id)
		);

		const newBodyCells = bodyRows.map((row) =>
			createBodyCell(newColumn.id, row.id)
		);
		const newFooterCells = footerRows.map((row) =>
			createFooterCell(newColumn.id, row.id)
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: [...columns, newColumn],
				headerCells: [...headerCells, ...newHeaderCells],
				bodyCells: [...bodyCells, ...newBodyCells],
				footerCells: [...footerCells, ...newFooterCells],
			},
		};
	}
	undo(prevState: TableState): TableState {
		if (this.newColumnId === undefined) throw new CommandUndoError();

		const { columns, headerCells, bodyCells, footerCells } =
			prevState.model;
		return {
			...prevState,
			model: {
				...prevState.model,
				columns: columns.filter(
					(column) => column.id !== this.newColumnId
				),
				headerCells: headerCells.filter(
					(cell) => cell.columnId !== this.newColumnId
				),
				bodyCells: bodyCells.filter(
					(cell) => cell.columnId !== this.newColumnId
				),
				footerCells: footerCells.filter(
					(cell) => cell.columnId !== this.newColumnId
				),
			},
		};
	}
}
