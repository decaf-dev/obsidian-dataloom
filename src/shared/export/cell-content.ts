import {
	BodyCell,
	BodyRow,
	CellType,
	Column,
	CurrencyType,
	DateFormat,
} from "../types/types";
import { stringToCurrencyString } from "../conversion";
import {
	unixTimeToDateString,
	unixTimeToDateTimeString,
} from "../date/date-conversion";
import { isCheckboxChecked, isNumber } from "../validators";

const getTagCellContent = (column: Column, cell: BodyCell) => {
	return column.tags
		.filter((tag) => cell.tagIds.includes(tag.id))
		.map((tag) => tag.markdown)
		.join(",");
};

export const getDateCellContent = (
	dateTime: number | null,
	format: DateFormat
) => {
	if (dateTime !== null) return unixTimeToDateString(dateTime, format);
	return "";
};

export const getTimeCellContent = (
	dateTime: number | null,
	format: DateFormat
) => {
	if (dateTime !== null) return unixTimeToDateTimeString(dateTime, format);
	return "";
};

export const getCheckboxContent = (
	markdown: string,
	shouldEscapeMarkdown: boolean
) => {
	if (shouldEscapeMarkdown) {
		if (isCheckboxChecked(markdown)) return "true";
		return "false";
	}
	return markdown;
};

export const getCurrencyCellContent = (
	value: string,
	currencyType: CurrencyType
) => {
	if (isNumber(value)) return stringToCurrencyString(value, currencyType);
	return value;
};

export const getCellContent = (
	column: Column,
	row: BodyRow,
	cell: BodyCell,
	shouldEscapeMarkdown: boolean
) => {
	switch (column.type) {
		case CellType.TEXT:
		case CellType.FILE:
		case CellType.NUMBER:
			return cell.markdown;
		case CellType.CHECKBOX:
			return getCheckboxContent(cell.markdown, shouldEscapeMarkdown);
		case CellType.CURRENCY:
			return getCurrencyCellContent(cell.markdown, column.currencyType);
		case CellType.TAG:
		case CellType.MULTI_TAG:
			return getTagCellContent(column, cell);
		case CellType.DATE:
			return getDateCellContent(cell.dateTime, column.dateFormat);
		case CellType.CREATION_TIME:
			return getTimeCellContent(row.creationTime, column.dateFormat);
		case CellType.LAST_EDITED_TIME:
			return getTimeCellContent(row.lastEditedTime, column.dateFormat);
	}
};
