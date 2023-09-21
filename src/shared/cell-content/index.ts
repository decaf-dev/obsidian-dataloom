import { App } from "obsidian";
import {
	BodyCell,
	BodyRow,
	CellType,
	Column,
} from "../loom-state/types/loom-state";
import { getCheckboxCellContent } from "./checkbox-cell-content";
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
	app: App,
	column: Column,
	row: BodyRow,
	cell: BodyCell,
	shouldRemoveMarkdown: boolean
) => {
	switch (column.type) {
		case CellType.TEXT:
		case CellType.FILE:
			return getTextCellContent(cell.markdown, shouldRemoveMarkdown);
		case CellType.NUMBER:
			return getNumberCellContent(column.numberFormat, cell.markdown, {
				currency: column.currencyType,
				prefix: column.numberPrefix,
				suffix: column.numberSuffix,
				separator: column.numberSeparator,
			});
		case CellType.EMBED:
			return getEmbedCellContent(app, cell.markdown, {
				isExport: true,
				isExternalLink: cell.isExternalLink,
				shouldRemoveMarkdown,
			});
		case CellType.CHECKBOX:
			return getCheckboxCellContent(cell.markdown, shouldRemoveMarkdown);
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
