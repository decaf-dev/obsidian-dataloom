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
import { isCheckboxChecked, isNumber, isURL } from "../validators";

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

export const getCheckboxContent = (markdown: string) => {
	if (isCheckboxChecked(markdown)) return "true";
	return "false";
};

export const getEmbedContent = (markdown: string) => {
	if (isURL(markdown)) return `![](${markdown})`;
	return markdown;
};

export const getNumberCellContent = (value: string) => {
	if (isNumber(value)) return value;
	return "";
};

export const getCurrencyCellContent = (
	value: string,
	currencyType: CurrencyType
) => {
	if (isNumber(value)) return stringToCurrencyString(value, currencyType);
	return "";
};

export const getCellContent = (
	column: Column,
	row: BodyRow,
	cell: BodyCell
) => {
	switch (column.type) {
		case CellType.TEXT:
		case CellType.FILE:
			return cell.markdown;
		case CellType.NUMBER:
			return getNumberCellContent(cell.markdown);
		case CellType.EMBED:
			return getEmbedContent(cell.markdown);
		case CellType.CHECKBOX:
			return getCheckboxContent(cell.markdown);
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
		default:
			throw new Error("Unsupported cell type");
	}
};
