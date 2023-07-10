import { BodyCell, BodyRow, Column, HeaderCell, TableState } from "../types";
import { getCellContent } from "../cell-content";
import { ColumNotFoundError } from "../table-state/dashboard-error";

const serializeHeaderCells = (cells: HeaderCell[]): string[] => {
	return cells.map((cell) => cell.markdown);
};

const serializeBodyCells = (
	columns: Column[],
	rows: BodyRow[],
	cells: BodyCell[],
	renderMarkdown: boolean
): string[][] => {
	return rows.map((row) => {
		const rowCells = cells.filter((cell) => cell.rowId === row.id);
		return rowCells.map((cell) => {
			const column = columns.find(
				(column) => column.id === cell.columnId
			);
			if (!column) throw new ColumNotFoundError(cell.columnId);
			return getCellContent(column, row, cell, renderMarkdown);
		});
	});
};

export const tableStateToArray = (
	tableState: TableState,
	renderMarkdown: boolean
): string[][] => {
	const { headerCells, bodyCells, bodyRows, columns } = tableState.model;
	const serializedHeaderCells = serializeHeaderCells(headerCells);
	const serializedBodyCells = serializeBodyCells(
		columns,
		bodyRows,
		bodyCells,
		renderMarkdown
	);
	return [serializedHeaderCells, ...serializedBodyCells];
};
