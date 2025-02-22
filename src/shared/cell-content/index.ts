import { App } from "obsidian";
import TagNotFoundError from "../error/tag-not-found-error";
import {
	CellType,
	type Cell,
	type CheckboxCell,
	type Column,
	type DateCell,
	type EmbedCell,
	type FileCell,
	type MultiTagCell,
	type NumberCell,
	type Row,
	type Source,
	type SourceFileCell,
	type TagCell,
	type TextCell,
} from "../loom-state/types/loom-state";
import { getCheckboxCellContent } from "./checkbox-cell-content";
import { getDateCellContent } from "./date-cell-content";
import { getEmbedCellContent } from "./embed-cell-content";
import { getNumberCellContent } from "./number-cell-content";
import { getSourceCellContent } from "./source-cell-content";
import { getSourceFileContent } from "./source-file-content";
import { getTextCellContent } from "./text-cell-content";
import { getTimeCellContent } from "./time-content";

const getTagCellContent = (column: Column, cell: TagCell) => {
	const { tagId } = cell;
	if (!tagId) return "";

	const tag = column.tags.find((tag) => tag.id === tagId);
	if (!tag) throw new TagNotFoundError(tagId);

	return tag.content;
};

const getMultiTagCellContent = (column: Column, cell: MultiTagCell) => {
	return column.tags
		.filter((tag) => cell.tagIds.includes(tag.id))
		.map((tag) => tag.content)
		.join(",");
};

//TODO clean up this file directory
export const getCellContent = (
	app: App,
	source: Source | null,
	column: Column,
	row: Row,
	cell: Cell,
	shouldRemoveMarkdown: boolean
): string => {
	const {
		currencyType,
		numberPrefix,
		numberSuffix,
		numberSeparator,
		numberFormat,
		dateFormat,
		dateFormatSeparator,
		includeTime,
		hour12,
	} = column;
	const { creationDateTime, lastEditedDateTime } = row;

	switch (column.type) {
		case CellType.TEXT: {
			const { content } = cell as TextCell;
			return getTextCellContent(content, shouldRemoveMarkdown);
		}
		case CellType.FILE: {
			const { path } = cell as FileCell;
			return getTextCellContent(path, shouldRemoveMarkdown);
		}
		case CellType.NUMBER: {
			const { value } = cell as NumberCell;
			return getNumberCellContent(numberFormat, value, {
				currency: currencyType,
				prefix: numberPrefix,
				suffix: numberSuffix,
				separator: numberSeparator,
			});
		}
		case CellType.EMBED: {
			const { pathOrUrl, isExternal } = cell as EmbedCell;
			return getEmbedCellContent(app, pathOrUrl, {
				isExport: true,
				isExternal,
				shouldRemoveMarkdown,
			});
		}
		case CellType.CHECKBOX: {
			const { value } = cell as CheckboxCell;
			return getCheckboxCellContent(value, shouldRemoveMarkdown);
		}
		case CellType.TAG:
			return getTagCellContent(column, cell as TagCell);
		case CellType.MULTI_TAG:
			return getMultiTagCellContent(column, cell as MultiTagCell);
		case CellType.DATE: {
			const { dateTime } = cell as DateCell;
			return getDateCellContent(
				dateTime,
				dateFormat,
				dateFormatSeparator,
				includeTime,
				hour12
			);
		}
		case CellType.CREATION_TIME: {
			return getTimeCellContent(
				creationDateTime,
				dateFormat,
				dateFormatSeparator,
				hour12
			);
		}
		case CellType.LAST_EDITED_TIME: {
			return getTimeCellContent(
				lastEditedDateTime,
				dateFormat,
				dateFormatSeparator,
				hour12
			);
		}
		case CellType.SOURCE: {
			return getSourceCellContent(source);
		}
		case CellType.SOURCE_FILE: {
			const { path } = cell as SourceFileCell;
			return getSourceFileContent(path, shouldRemoveMarkdown);
		}
		default:
			throw new Error("Unsupported cell type");
	}
};
