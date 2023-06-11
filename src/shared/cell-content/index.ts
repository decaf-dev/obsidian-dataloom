import { BodyCell, BodyRow, CellType, Column } from "../types";
import { getCheckboxCellContent } from "./checkbox-cell-content";
import { getCurrencyCellContent } from "./currency-cell-content";
import { getDateCellContent } from "./date-cell-content";
import { getEmbedCellContent } from "./embed-cell-content";
import { getNumberCellContent } from "./number-cell-content";
import { getTextCellContent } from "./text-cell-content";
import { getTimeCellContent } from "./time-content";

const getTagCellContent = (column: Column, cell: BodyCell) => {
	return column.tags
		.filter((tag) => cell.tagIds.includes(tag.id))
		.map((tag) => tag.markdown)
		.join(",");
};

export const getCellContent = (
	column: Column,
	row: BodyRow,
	cell: BodyCell,
	renderMarkdown: boolean
) => {
	switch (column.type) {
		case CellType.TEXT:
		case CellType.FILE:
			return getTextCellContent(cell.markdown, renderMarkdown);
		case CellType.NUMBER:
			return getNumberCellContent(cell.markdown);
		case CellType.EMBED:
			return getEmbedCellContent(cell.markdown, renderMarkdown);
		case CellType.CHECKBOX:
			return getCheckboxCellContent(cell.markdown, renderMarkdown);
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
