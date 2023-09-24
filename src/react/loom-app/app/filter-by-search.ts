import {
	Cell,
	Row,
	CellType,
	Column,
	CurrencyType,
	DateFormat,
	LoomState,
	NumberFormat,
	Tag,
} from "src/shared/loom-state/types/loom-state";
import { getTimeCellContent } from "src/shared/cell-content/time-content";
import { getDateCellContent } from "src/shared/cell-content/date-cell-content";
import { getNumberCellContent } from "src/shared/cell-content/number-cell-content";
import ColumNotFoundError from "src/shared/error/column-not-found-error";

export const filterRowsBySearch = (
	state: LoomState,
	rows: Row[],
	searchText: string
): Row[] => {
	const { columns } = state.model;
	if (searchText === "") return rows;

	const columnIdToColumn = new Map<string, Column>();
	columns.forEach((column) => {
		columnIdToColumn.set(column.id, column);
	});

	const cellIdToColumn = new Map<string, Column>();
	rows.forEach((row) => {
		const { cells } = row;
		cells.forEach((cell) => {
			const column = columnIdToColumn.get(cell.columnId);
			if (!column) throw new ColumNotFoundError();
			cellIdToColumn.set(cell.id, column);
		});
	});

	return rows.filter((row) => {
		const { cells } = row;
		return cells.some((cell) => {
			const column = cellIdToColumn.get(cell.id);
			if (!column) throw new ColumNotFoundError();
			return doesCellMatch(cell, column, row, searchText.toLowerCase());
		});
	});
};

const doesCellMatch = (
	cell: Cell,
	column: Column,
	row: Row,
	searchText: string
) => {
	const { dateTime, content } = cell;
	const {
		currencyType,
		type,
		dateFormat,
		numberFormat,
		numberPrefix,
		numberSuffix,
		numberSeparator,
		tags,
	} = column;

	const { lastEditedTime, creationTime } = row;
	const cellTags = tags.filter((tag) => cell.tagIds.includes(tag.id));

	switch (type) {
		case CellType.TEXT:
		case CellType.EMBED:
		case CellType.FILE:
		case CellType.CHECKBOX:
			return matchTextCell(content, searchText);
		case CellType.NUMBER:
			return matchNumberCell(
				numberFormat,
				numberPrefix,
				numberSuffix,
				numberSeparator,
				currencyType,
				content,
				searchText
			);
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

const matchTextCell = (cellContent: string, searchText: string) => {
	return cellContent.toLowerCase().includes(searchText);
};

const matchNumberCell = (
	numberFormat: NumberFormat,
	prefix: string,
	suffix: string,
	separator: string,
	currencyType: CurrencyType,
	cellContent: string,
	searchText: string
) => {
	const content = getNumberCellContent(numberFormat, cellContent, {
		currency: currencyType,
		prefix,
		suffix,
		separator,
	});
	return content.toLowerCase().includes(searchText.toLowerCase());
};

const matchTags = (cellTags: Tag[], searchText: string) => {
	return cellTags.some((tag) =>
		tag.content.toLowerCase().includes(searchText)
	);
};

const matchDateCell = (
	dateFormat: DateFormat,
	dateTime: number | null,
	searchText: string
): boolean => {
	const content = getDateCellContent(dateTime, dateFormat);
	return content.toLowerCase().includes(searchText);
};

const matchCreationTimeCell = (
	creationTime: number,
	dateFormat: DateFormat,
	searchText: string
): boolean => {
	const content = getTimeCellContent(creationTime, dateFormat);
	return content.toLowerCase().includes(searchText);
};

const matchLastEditedTimeCell = (
	lastEditedTime: number,
	dateFormat: DateFormat,
	searchText: string
): boolean => {
	const content = getTimeCellContent(lastEditedTime, dateFormat);
	return content.toLowerCase().includes(searchText);
};
