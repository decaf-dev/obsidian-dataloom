import { Row, Column, LoomState, Source } from "../loom-state/types/loom-state";
import { getCellContent } from "../cell-content";
import ColumNotFoundError from "../error/column-not-found-error";
import { App } from "obsidian";

const serializeColumns = (columns: Column[]): string[] => {
	return columns.map((column) => column.content);
};

const serializeCells = (
	app: App,
	sources: Source[],
	columns: Column[],
	rows: Row[],
	shouldRemoveMarkdown: boolean
): string[][] => {
	return rows.map((row) => {
		const { cells } = row;
		return cells.map((cell) => {
			const column = columns.find(
				(column) => column.id === cell.columnId
			);
			if (!column) throw new ColumNotFoundError(cell.columnId);
			const source =
				sources.find((source) => source.id === row.sourceId) ?? null;

			const content = getCellContent(
				app,
				source,
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
	const { rows, columns, sources } = loomState.model;
	const serializedColumns = serializeColumns(columns);
	const serializedCells = serializeCells(
		app,
		sources,
		columns,
		rows,
		shouldRemoveMarkdown
	);
	return [serializedColumns, ...serializedCells];
};
