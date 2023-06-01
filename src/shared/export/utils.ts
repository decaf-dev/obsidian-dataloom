import { get, isNumber } from "lodash";
import {
	BodyCell,
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

export const getCurrencyCellContent = (
	value: string,
	currencyType: CurrencyType
) => {
	if (isNumber(value)) return stringToCurrencyString(value, currencyType);
	return value;
};

export const getCellContent = (column: Column, cell: BodyCell) => {
	switch (column.type) {
		case CellType.TEXT:
		case CellType.FILE:
		case CellType.CHECKBOX:
		case CellType.NUMBER:
			return cell.markdown;
		case CellType.CURRENCY:
			return getCurrencyCellContent(cell.markdown, column.currencyType);
		case CellType.TAG:
		case CellType.MULTI_TAG:
			return getTagCellContent(column, cell);
		case CellType.DATE:
			return getDateCellContent(cell.dateTime, column.dateFormat);
		case CellType.CREATION_TIME:
		case CellType.LAST_EDITED_TIME:
			return getTimeCellContent(cell.dateTime, column.dateFormat);
	}
};
