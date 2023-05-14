import {
	BodyCell,
	Column,
	FooterCell,
	HeaderCell,
	TableState,
} from "../table-state/types";
import {
	createBodyCell,
	createColumn,
	createFooterCell,
	createHeaderCell,
} from "src/data/table-state-factory";
import TableStateCommand from "../table-state/table-state-command";
import { CommandRedoError, CommandUndoError } from "./command-errors";

export default class ColumnAddCommand implements TableStateCommand {
	newColumn?: Column;
	newHeaderCells?: HeaderCell[];
	newBodyCells?: BodyCell[];
	newFooterCells?: FooterCell[];

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

		const newColumn = createColumn();
		this.newColumn = newColumn;

		const newHeaderCells = headerRows.map((row) =>
			createHeaderCell(newColumn.id, row.id)
		);
		this.newHeaderCells = newHeaderCells;

		const newBodyCells = bodyRows.map((row) =>
			createBodyCell(newColumn.id, row.id)
		);
		this.newBodyCells = newBodyCells;

		const newFooterCells = footerRows.map((row) =>
			createFooterCell(newColumn.id, row.id)
		);
		this.newFooterCells = newFooterCells;

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

	redo(prevState: TableState): TableState {
		const newColumn = this.newColumn;
		const newHeaderCells = this.newHeaderCells;
		const newBodyCells = this.newBodyCells;
		const newFooterCells = this.newFooterCells;

		if (
			newColumn === undefined ||
			newHeaderCells === undefined ||
			newBodyCells === undefined ||
			newFooterCells === undefined
		)
			throw new CommandRedoError();

		const { headerCells, bodyCells, footerCells, columns } =
			prevState.model;

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
		const newColumn = this.newColumn;
		if (newColumn === undefined) throw new CommandUndoError();

		const { columns, headerCells, bodyCells, footerCells } =
			prevState.model;
		return {
			...prevState,
			model: {
				...prevState.model,
				columns: columns.filter((column) => column.id !== newColumn.id),
				headerCells: headerCells.filter(
					(cell) => cell.columnId !== newColumn.id
				),
				bodyCells: bodyCells.filter(
					(cell) => cell.columnId !== newColumn.id
				),
				footerCells: footerCells.filter(
					(cell) => cell.columnId !== newColumn.id
				),
			},
		};
	}
}
