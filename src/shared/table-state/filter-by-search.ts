import {
	BodyCell,
	BodyRow,
	CellType,
	Column,
	CurrencyType,
	DateFormat,
	TableState,
	Tag,
} from "src/shared/table-state/types";
import { ColumnIdError, RowIdError } from "./table-error";
import { stringToCurrencyString } from "../conversion";
import {
	unixTimeToDateString,
	unixTimeToDateTimeString,
} from "../date/date-conversion";

export const filterBodyRowsBySearch = (
	tableState: TableState,
	filteredBodyRows: BodyRow[],
	searchText: string
): BodyRow[] => {
	const { columns, bodyCells, bodyRows, tags } = tableState.model;
	const columnMap = new Map<string, Column>();
	columns.forEach((column) => columnMap.set(column.id, column));

	const rowMap = new Map<string, BodyRow>();
	bodyRows.forEach((row) => rowMap.set(row.id, row));

	const cellToTagMap = new Map<string, Tag[]>();
	bodyCells.forEach((cell) => {
		const cellTags = tags.filter((tag) => tag.cellIds.includes(cell.id));
		cellToTagMap.set(cell.id, cellTags);
	});

	return filteredBodyRows.filter((row) => {
		const rowCells = bodyCells.filter((cell) => cell.rowId === row.id);
		return rowCells.some((cell) => {
			const cellTags = cellToTagMap.get(cell.id);
			if (!cellTags)
				throw new Error(`Tags not found for cell ${cell.id}`);

			const match = doesCellMatch(
				cell,
				columnMap,
				rowMap,
				cellTags,
				searchText.toLowerCase()
			);
			console.log(match);
			return match;
		});
	});
};

const doesCellMatch = (
	cell: BodyCell,
	columnMap: Map<string, Column>,
	rowMap: Map<String, BodyRow>,
	cellTags: Tag[],
	searchText: string
) => {
	const column = columnMap.get(cell.columnId);
	if (!column) throw new ColumnIdError(cell.columnId);
	const row = rowMap.get(cell.rowId);
	if (!row) throw new RowIdError(cell.rowId);

	const { dateTime, markdown } = cell;
	const { currencyType, type, dateFormat } = column;
	const { lastEditedTime, creationTime } = row;

	switch (type) {
		case CellType.TEXT:
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
			return matchTags(cellTags, searchText);
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
	const currencyString = stringToCurrencyString(markdown, currencyType);
	if (currencyString.toLowerCase().includes(searchText.toLowerCase()))
		return true;
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
	if (dateTime) {
		const dateString = unixTimeToDateString(dateTime, dateFormat);
		if (dateString.toLowerCase().includes(searchText)) return true;
	}
	return false;
};

const matchCreationTimeCell = (
	creationTime: number,
	dateFormat: DateFormat,
	searchText: string
) => {
	const dateString = unixTimeToDateTimeString(creationTime, dateFormat);
	if (dateString.toLowerCase().includes(searchText)) return true;
	return false;
};

const matchLastEditedTimeCell = (
	lastEditedTime: number,
	dateFormat: DateFormat,
	searchText: string
) => {
	const dateString = unixTimeToDateString(lastEditedTime, dateFormat);
	if (dateString.toLowerCase().includes(searchText)) return true;
	return false;
};
