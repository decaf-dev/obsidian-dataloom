import { Cell, Row, Column, LoomState } from "../loom-state/types/loom-state";
import { getCellContent } from "../cell-content";
import ColumNotFoundError from "../error/column-not-found-error";
import { App } from "obsidian";

const serializeHeaderCells = (columns: Column[]): string[] => {
	return columns.map((column) => column.content);
};

const serializeBodyCells = (
	app: App,
	columns: Column[],
	rows: Row[],
	cells: Cell[],
	shouldRemoveMarkdown: boolean
): string[][] => {
	return rows.map((row) => {
		const rowCells = cells.filter((cell) => cell.rowId === row.id);
		return rowCells.map((cell) => {
			const column = columns.find(
				(column) => column.id === cell.columnId
			);
			if (!column) throw new ColumNotFoundError(cell.columnId);
			const content = getCellContent(
				app,
				column,
				row,
				cell,
				shouldRemoveMarkdown
			);
			return content;
		});
	});
};

export const loomStateToArray = (
	app: App,
	loomState: LoomState,
	shouldRemoveMarkdown: boolean
): string[][] => {
	const { bodyCells, rows, columns } = loomState.model;
	const serializedHeaderCells = serializeHeaderCells(columns);
	const serializedBodyCells = serializeBodyCells(
		app,
		columns,
		rows,
		bodyCells,
		shouldRemoveMarkdown
	);
	return [serializedHeaderCells, ...serializedBodyCells];
};
