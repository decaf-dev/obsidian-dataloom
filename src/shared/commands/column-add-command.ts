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

export default class ColumnAddCommand extends TableStateCommand {
	newColumn: Column;
	newHeaderCells: HeaderCell[];
	newBodyCells: BodyCell[];
	newFooterCells: FooterCell[];

	execute(prevState: TableState): TableState {
		super.onExecute();

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

		this.newHeaderCells = headerRows.map((row) =>
			createHeaderCell(newColumn.id, row.id)
		);

		this.newBodyCells = bodyRows.map((row) =>
			createBodyCell(newColumn.id, row.id)
		);

		this.newFooterCells = footerRows.map((row) =>
			createFooterCell(newColumn.id, row.id)
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: [...columns, newColumn],
				headerCells: [...headerCells, ...this.newHeaderCells],
				bodyCells: [...bodyCells, ...this.newBodyCells],
				footerCells: [...footerCells, ...this.newFooterCells],
			},
		};
	}

	redo(prevState: TableState): TableState {
		super.onRedo();

		const { headerCells, bodyCells, footerCells, columns } =
			prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: [...columns, this.newColumn],
				headerCells: [...headerCells, ...this.newHeaderCells],
				bodyCells: [...bodyCells, ...this.newBodyCells],
				footerCells: [...footerCells, ...this.newFooterCells],
			},
		};
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

		const { columns, headerCells, bodyCells, footerCells } =
			prevState.model;

		const { id } = this.newColumn;
		return {
			...prevState,
			model: {
				...prevState.model,
				columns: columns.filter((column) => column.id !== id),
				headerCells: headerCells.filter((cell) => cell.columnId !== id),
				bodyCells: bodyCells.filter((cell) => cell.columnId !== id),
				footerCells: footerCells.filter((cell) => cell.columnId !== id),
			},
		};
	}
}
