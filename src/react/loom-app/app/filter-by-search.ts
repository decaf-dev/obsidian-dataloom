import {
	Cell,
	Row,
	CellType,
	Column,
	CurrencyType,
	DateFormat,
	NumberFormat,
	Tag,
	Source,
	DateFormatSeparator,
	TextCell,
	EmbedCell,
	FileCell,
	CheckboxCell,
	SourceFileCell,
	DateCell,
	NumberCell,
	MultiTagCell,
	TagCell,
} from "src/shared/loom-state/types/loom-state";
import { getTimeCellContent } from "src/shared/cell-content/time-content";
import { getDateCellContent } from "src/shared/cell-content/date-cell-content";
import { getNumberCellContent } from "src/shared/cell-content/number-cell-content";
import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import { getSourceCellContent } from "src/shared/cell-content/source-cell-content";
import { getSourceFileContent } from "src/shared/cell-content/source-file-content";
import { getCheckboxCellContent } from "src/shared/cell-content/checkbox-cell-content";
import TagNotFoundError from "src/shared/error/tag-not-found-error";
import { getFileNameFromPath } from "src/shared/link/path-utils";
import { isRelativePath } from "src/shared/link/check-link";

export const filterRowsBySearch = (
	sources: Source[],
	columns: Column[],
	rows: Row[],
	searchText: string
): Row[] => {
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
			if (!column) throw new ColumnNotFoundError({ id: cell.columnId });
			cellIdToColumn.set(cell.id, column);
		});
	});

	return rows.filter((row) => {
		const { cells } = row;
		return cells.some((cell) => {
			const column = cellIdToColumn.get(cell.id);
			if (!column) throw new ColumnNotFoundError({ id: cell.columnId });
			return doesCellMatch(
				sources,
				cell,
				column,
				row,
				searchText.toLowerCase()
			);
		});
	});
};

const doesCellMatch = (
	sources: Source[],
	cell: Cell,
	column: Column,
	row: Row,
	searchText: string
) => {
	const {
		currencyType,
		type,
		dateFormat,
		numberFormat,
		numberPrefix,
		numberSuffix,
		numberSeparator,
		dateFormatSeparator,
		tags,
		includeTime,
		hour12,
	} = column;

	const { lastEditedDateTime, creationDateTime, sourceId } = row;

	switch (type) {
		case CellType.TEXT: {
			const { content } = cell as TextCell;
			return matchTextCell(content, searchText);
		}
		case CellType.EMBED: {
			const { pathOrUrl } = cell as EmbedCell;
			let searchValue = "";
			if (isRelativePath(pathOrUrl)) {
				searchValue = getFileNameFromPath(pathOrUrl);
			}
			return matchTextCell(searchValue, searchText);
		}
		case CellType.FILE: {
			const { path } = cell as FileCell;
			const fileName = getFileNameFromPath(path);
			return matchTextCell(fileName, searchText);
		}
		case CellType.CHECKBOX: {
			const { value } = cell as CheckboxCell;
			return matchCheckboxCell(value, searchText);
		}
		case CellType.NUMBER: {
			const { value } = cell as NumberCell;
			return matchNumberCell(
				numberFormat,
				numberPrefix,
				numberSuffix,
				numberSeparator,
				currencyType,
				value,
				searchText
			);
		}
		case CellType.DATE: {
			const { dateTime } = cell as DateCell;
			return matchDateCell(
				dateTime,
				dateFormat,
				dateFormatSeparator,
				includeTime,
				hour12,
				searchText
			);
		}
		case CellType.CREATION_TIME:
			return matchCreationTimeCell(
				creationDateTime,
				dateFormat,
				dateFormatSeparator,
				hour12,
				searchText
			);
		case CellType.LAST_EDITED_TIME:
			return matchLastEditedTimeCell(
				lastEditedDateTime,
				dateFormat,
				dateFormatSeparator,
				hour12,
				searchText
			);
		case CellType.TAG: {
			const { tagId } = cell as TagCell;
			return matchTag(tags, tagId, searchText);
		}
		case CellType.MULTI_TAG: {
			const { tagIds } = cell as MultiTagCell;
			return matchTags(tags, tagIds, searchText);
		}
		case CellType.SOURCE: {
			return matchSourceCell(sources, sourceId, searchText);
		}
		case CellType.SOURCE_FILE: {
			const { path } = cell as SourceFileCell;
			const fileName = getFileNameFromPath(path);
			return matchSourceFileCell(fileName, searchText);
		}
		default:
			throw new Error("Unsupported cell type");
	}
};

const matchCheckboxCell = (value: boolean, searchText: string) => {
	const content = getCheckboxCellContent(value, true);
	return content.toLowerCase().includes(searchText);
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
	cellValue: number | null,
	searchText: string
) => {
	const content = getNumberCellContent(numberFormat, cellValue, {
		currency: currencyType,
		prefix,
		suffix,
		separator,
	});
	return content.toLowerCase().includes(searchText.toLowerCase());
};

const matchTag = (
	columnTags: Tag[],
	cellTagId: string | null,
	searchText: string
) => {
	if (!cellTagId) return false;

	const tag = columnTags.find((tag) => tag.id === cellTagId);
	if (!tag) throw new TagNotFoundError(cellTagId);

	return tag.content.toLowerCase().includes(searchText);
};

const matchTags = (
	columnTags: Tag[],
	cellTagIds: string[],
	searchText: string
) => {
	const cellTags = columnTags.filter((tag) => cellTagIds.includes(tag.id));
	return cellTags.some((tag) =>
		tag.content.toLowerCase().includes(searchText)
	);
};

const matchDateCell = (
	dateTime: string | null,
	dateFormat: DateFormat,
	dateFormatSeparator: DateFormatSeparator,
	includeTime: boolean,
	hour12: boolean,
	searchText: string
): boolean => {
	const content = getDateCellContent(
		dateTime,
		dateFormat,
		dateFormatSeparator,
		includeTime,
		hour12
	);
	return content.toLowerCase().includes(searchText);
};

const matchCreationTimeCell = (
	creationDateTime: string,
	dateFormat: DateFormat,
	dateFormatSeparator: DateFormatSeparator,
	hour12: boolean,
	searchText: string
): boolean => {
	const content = getTimeCellContent(
		creationDateTime,
		dateFormat,
		dateFormatSeparator,
		hour12
	);
	return content.toLowerCase().includes(searchText);
};

const matchLastEditedTimeCell = (
	lastEditedDateTime: string,
	dateFormat: DateFormat,
	dateFormatSeparator: DateFormatSeparator,
	hour12: boolean,
	searchText: string
): boolean => {
	const content = getTimeCellContent(
		lastEditedDateTime,
		dateFormat,
		dateFormatSeparator,
		hour12
	);
	return content.toLowerCase().includes(searchText);
};

const matchSourceFileCell = (originalContent: string, searchText: string) => {
	const content = getSourceFileContent(originalContent, true);
	return content.toLowerCase().includes(searchText);
};

const matchSourceCell = (
	sources: Source[],
	sourceId: string | null,
	searchText: string
) => {
	const source = sources.find((source) => source.id === sourceId) ?? null;
	const content = getSourceCellContent(source);
	return content.toLowerCase().includes(searchText);
};
