import {
	BodyCell,
	BodyRow,
	CellType,
	Column,
	CurrencyType,
	DateFormat,
	LoomState,
	Tag,
} from "src/shared/loom-state/types";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import ColumNotFoundError from "src/shared/error/column-not-found-error";
import { getTimeCellContent } from "src/shared/cell-content/time-content";
import { getDateCellContent } from "src/shared/cell-content/date-cell-content";
import { getCurrencyCellContent } from "src/shared/cell-content/currency-cell-content";

type CellWithReferences = {
	cell: BodyCell;
	column: Column;
	row: BodyRow;
	tags: Tag[];
};

export const filterBodyRowsBySearch = (
	state: LoomState,
	filteredBodyRows: BodyRow[],
	searchText: string
): BodyRow[] => {
	const { columns, bodyCells, bodyRows } = state.model;

	const cells: CellWithReferences[] = bodyCells.map((cell) => {
		const column = columns.find((c) => c.id === cell.columnId);
		if (!column) throw new ColumNotFoundError(cell.columnId);

		const row = bodyRows.find((r) => r.id === cell.rowId);
		if (!row) throw new RowNotFoundError(cell.rowId);

		const tags = column.tags.filter((tag) => cell.tagIds.includes(tag.id));

		return { cell, column, row, tags };
	});

	if (searchText === "") return filteredBodyRows;

	return filteredBodyRows.filter((row) => {
		const filteredCells = cells.filter((cell) => cell.row.id === row.id);
		return filteredCells.some((cell) => {
			return doesCellMatch(cell, searchText.toLowerCase());
		});
	});
};

const doesCellMatch = (cell: CellWithReferences, searchText: string) => {
	const { dateTime, markdown } = cell.cell;
	const { currencyType, type, dateFormat } = cell.column;
	const { lastEditedTime, creationTime } = cell.row;

	switch (type) {
		case CellType.TEXT:
		case CellType.EMBED:
		case CellType.FILE:
		case CellType.NUMBER:
		case CellType.CHECKBOX:
			return matchCell(markdown, searchText);
		case CellType.CURRENCY:
			return matchCurrencyCell(markdown, currencyType, searchText);
		case CellType.DATE:
			return matchDateCell(dateFormat, dateTime, searchText);
		case CellType.CREATION_TIME:
			return matchCreationTimeCell(creationTime, dateFormat, searchText);
		case CellType.LAST_EDITED_TIME:
			return matchLastEditedTimeCell(
				lastEditedTime,
				dateFormat,
				searchText
			);
		case CellType.TAG:
		case CellType.MULTI_TAG:
			return matchTags(cell.tags, searchText);
		default:
			throw new Error("Unsupported cell type");
	}
};

const matchCell = (markdown: string, searchText: string) => {
	return markdown.toLowerCase().includes(searchText);
};

const matchCurrencyCell = (
	markdown: string,
	currencyType: CurrencyType,
	searchText: string
) => {
	const content = getCurrencyCellContent(markdown, currencyType);
	if (content.toLowerCase().includes(searchText.toLowerCase())) return true;
};

const matchTags = (cellTags: Tag[], searchText: string) => {
	return cellTags.some((tag) =>
		tag.markdown.toLowerCase().includes(searchText)
	);
};

const matchDateCell = (
	dateFormat: DateFormat,
	dateTime: number | null,
	searchText: string
) => {
	const content = getDateCellContent(dateTime, dateFormat);
	return content.toLowerCase().includes(searchText);
};

const matchCreationTimeCell = (
	creationTime: number,
	dateFormat: DateFormat,
	searchText: string
) => {
	const content = getTimeCellContent(creationTime, dateFormat);
	return content.toLowerCase().includes(searchText);
};

const matchLastEditedTimeCell = (
	lastEditedTime: number,
	dateFormat: DateFormat,
	searchText: string
) => {
	const content = getTimeCellContent(lastEditedTime, dateFormat);
	return content.toLowerCase().includes(searchText);
};
