import { App } from "obsidian";
import { Cell, Row, CellType, Column } from "../loom-state/types/loom-state";
import { getCheckboxCellContent } from "./checkbox-cell-content";
import { getDateCellContent } from "./date-cell-content";
import { getEmbedCellContent } from "./embed-cell-content";
import { getNumberCellContent } from "./number-cell-content";
import { getTextCellContent } from "./text-cell-content";
import { getTimeCellContent } from "./time-content";

const getTagCellContent = (column: Column, cell: Cell) => {
	return column.tags
		.filter((tag) => cell.tagIds.includes(tag.id))
		.map((tag) => tag.content)
		.join(",");
};

export const getCellContent = (
	app: App,
	column: Column,
	row: Row,
	cell: Cell,
	shouldRemoveMarkdown: boolean
) => {
	const { content: cellContent } = cell;
	switch (column.type) {
		case CellType.TEXT:
		case CellType.FILE:
			return getTextCellContent(cellContent, shouldRemoveMarkdown);
		case CellType.NUMBER:
			return getNumberCellContent(column.numberFormat, cellContent, {
				currency: column.currencyType,
				prefix: column.numberPrefix,
				suffix: column.numberSuffix,
				separator: column.numberSeparator,
			});
		case CellType.EMBED:
			return getEmbedCellContent(app, cellContent, {
				isExport: true,
				isExternalLink: cell.isExternalLink,
				shouldRemoveMarkdown,
			});
		case CellType.CHECKBOX:
			return getCheckboxCellContent(cellContent, shouldRemoveMarkdown);
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
