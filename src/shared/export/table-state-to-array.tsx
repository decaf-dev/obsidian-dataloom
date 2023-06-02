import {
	BodyCell,
	BodyRow,
	Column,
	HeaderCell,
	TableState,
} from "../types/types";
import { getCellContent } from "./cell-content";
import { ColumNotFoundError } from "../table-state/table-error";

const serializeHeaderCells = (cells: HeaderCell[]): string[] => {
	return cells.map((cell) => cell.markdown);
};

const serializeBodyCells = (
	columns: Column[],
	rows: BodyRow[],
	cells: BodyCell[],
	shouldEscapeMarkdown: boolean
): string[][] => {
	return rows.map((row) => {
		const rowCells = cells.filter((cell) => cell.rowId === row.id);
		return rowCells.map((cell) => {
			const column = columns.find(
				(column) => column.id === cell.columnId
			);
			if (!column) throw new ColumNotFoundError(cell.columnId);
			return getCellContent(column, row, cell, shouldEscapeMarkdown);
		});
	});
};

export const tableStateToArray = (
	tableState: TableState,
	shouldEscapeMarkdown: boolean
): string[][] => {
	const { headerCells, bodyCells, bodyRows, columns } = tableState.model;
	const serializedHeaderCells = serializeHeaderCells(headerCells);
	const serializedBodyCells = serializeBodyCells(
		columns,
		bodyRows,
		bodyCells,
		shouldEscapeMarkdown
	);
	return [serializedHeaderCells, ...serializedBodyCells];
};
