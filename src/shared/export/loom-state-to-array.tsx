import {
	BodyCell,
	BodyRow,
	Column,
	HeaderCell,
	LoomState,
} from "../loom-state/types";
import { getCellContent } from "../cell-content";
import ColumNotFoundError from "../error/column-not-found-error";
import { App } from "obsidian";

const escapePipeCharacters = (value: string) => value.replace(/\|/g, "\\|");

const serializeHeaderCells = (cells: HeaderCell[]): string[] => {
	return cells.map((cell) => cell.markdown);
};

const serializeBodyCells = (
	app: App,
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
			const content = getCellContent(
				app,
				column,
				row,
				cell,
				renderMarkdown
			);
			//Markdown table cells can't contain pipe characters, so we escape them
			//Obsidian will render the escaped pipe characters as normal pipe characters
			const escapedContent = escapePipeCharacters(content);
			return escapedContent;
		});
	});
};

export const loomStateToArray = (
	app: App,
	loomState: LoomState,
	renderMarkdown: boolean
): string[][] => {
	const { headerCells, bodyCells, bodyRows, columns } = loomState.model;
	const serializedHeaderCells = serializeHeaderCells(headerCells);
	const serializedBodyCells = serializeBodyCells(
		app,
		columns,
		bodyRows,
		bodyCells,
		renderMarkdown
	);
	return [serializedHeaderCells, ...serializedBodyCells];
};
