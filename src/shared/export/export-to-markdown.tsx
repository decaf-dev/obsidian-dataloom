import {
	BodyCell,
	BodyRow,
	Column,
	HeaderCell,
	TableState,
} from "../types/types";
import { markdownTable } from "markdown-table";
import { getCellContent } from "./utils";
import { ColumNotFoundError } from "../table-state/table-error";

const serializeHeaderCells = (cells: HeaderCell[]): string[] => {
	return cells.map((cell) => cell.markdown);
};

const serializeBodyCells = (
	columns: Column[],
	rows: BodyRow[],
	cells: BodyCell[]
): string[][] => {
	return rows.map((row) => {
		const rowCells = cells.filter((cell) => cell.rowId === row.id);
		return rowCells.map((cell) => {
			const column = columns.find(
				(column) => column.id === cell.columnId
			);
			if (!column) throw new ColumNotFoundError(cell.columnId);
			return getCellContent(column, cell);
		});
	});
};

const getTableArray = (tableState: TableState): string[][] => {
	const { headerCells, bodyCells, bodyRows, columns } = tableState.model;
	const serializedHeaderCells = serializeHeaderCells(headerCells);
	const serializedBodyCells = serializeBodyCells(
		columns,
		bodyRows,
		bodyCells
	);
	return [serializedHeaderCells, ...serializedBodyCells];
};

export const exportToMarkdown = (tableState: TableState): string => {
	//Get table string
	const tableArr = getTableArray(tableState);
	return markdownTable(tableArr);
};
