import { App } from "obsidian";
import {
	Cell,
	Row,
	CellType,
	Column,
	Source,
} from "../loom-state/types/loom-state";
import { getCheckboxCellContent } from "./checkbox-cell-content";
import { getDateCellContent } from "./date-cell-content";
import { getEmbedCellContent } from "./embed-cell-content";
import { getNumberCellContent } from "./number-cell-content";
import { getTextCellContent } from "./text-cell-content";
import { getTimeCellContent } from "./time-content";
import { getSourceCellContent } from "./source-cell-content";
import { getSourceFileContent } from "./source-file-content";

const getTagCellContent = (column: Column, cell: Cell) => {
	return column.tags
		.filter((tag) => cell.tagIds.includes(tag.id))
		.map((tag) => tag.content)
		.join(",");
};

export const getCellContent = (
	app: App,
	source: Source | null,
	column: Column,
	row: Row,
	cell: Cell,
	shouldRemoveMarkdown: boolean
) => {
	const { content } = cell;
	switch (column.type) {
		case CellType.TEXT:
		case CellType.FILE:
			return getTextCellContent(content, shouldRemoveMarkdown);
		case CellType.NUMBER:
			return getNumberCellContent(column.numberFormat, content, {
				currency: column.currencyType,
				prefix: column.numberPrefix,
				suffix: column.numberSuffix,
				separator: column.numberSeparator,
			});
		case CellType.EMBED:
			return getEmbedCellContent(app, content, {
				isExport: true,
				isExternalLink: cell.isExternalLink,
				shouldRemoveMarkdown,
			});
		case CellType.CHECKBOX:
			return getCheckboxCellContent(content, shouldRemoveMarkdown);
		case CellType.TAG:
		case CellType.MULTI_TAG:
			return getTagCellContent(column, cell);
		case CellType.DATE:
			return getDateCellContent(cell.dateTime, column.dateFormat);
		case CellType.CREATION_TIME:
			return getTimeCellContent(row.creationTime, column.dateFormat);
		case CellType.LAST_EDITED_TIME:
			return getTimeCellContent(row.lastEditedTime, column.dateFormat);
		case CellType.SOURCE: {
			return getSourceCellContent(source);
		}
		case CellType.SOURCE_FILE:
			return getSourceFileContent(content, shouldRemoveMarkdown);
		default:
			throw new Error("Unsupported cell type");
	}
};
