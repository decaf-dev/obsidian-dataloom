import {
	Cell,
	Row,
	GeneralCalculation,
	CalculationType,
	CellType,
	DateFormat,
	Tag,
	Source,
	DateFormatSeparator,
	CheckboxCell,
	TextCell,
	EmbedCell,
	NumberCell,
	FileCell,
	DateCell,
	TagCell,
	MultiTagCell,
	SourceFileCell,
} from "src/shared/loom-state/types/loom-state";
import { hashString, round2Digits } from "./utils";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import TagNotFoundError from "src/shared/error/tag-not-found-error";
import { dateTimeToDateString } from "src/shared/date/date-time-conversion";
import { getSourceCellContent } from "src/shared/cell-content/source-cell-content";
import { getColumnCells } from "src/shared/loom-state/utils/column-utils";
import { getFileNameFromPath } from "src/shared/link/path-utils";

export const getGeneralCalculationContent = (
	columnId: string,
	sources: Source[],
	rows: Row[],
	columnTags: Tag[],
	cellType: CellType,
	calculationType: CalculationType,
	dateFormat: DateFormat,
	dateFormatSeparator: DateFormatSeparator
): string => {
	const columnCells = getColumnCells(rows, columnId);

	return getCalculation(
		sources,
		columnCells,
		rows,
		columnTags,
		cellType,
		calculationType,
		dateFormat,
		dateFormatSeparator
	).toString();
};

const getCalculation = (
	sources: Source[],
	columnCells: Cell[],
	rows: Row[],
	columnTags: Tag[],
	cellType: CellType,
	calculationType: CalculationType,
	dateFormat: DateFormat,
	dateFormatSeparator: DateFormatSeparator
) => {
	if (calculationType === GeneralCalculation.COUNT_ALL) {
		return countAll(rows);
	} else if (calculationType === GeneralCalculation.COUNT_EMPTY) {
		return countEmpty(columnCells, cellType);
	} else if (calculationType === GeneralCalculation.COUNT_NOT_EMPTY) {
		return countNotEmpty(columnCells, cellType);
	} else if (calculationType === GeneralCalculation.COUNT_UNIQUE) {
		return countUnique(
			sources,
			rows,
			columnCells,
			columnTags,
			cellType,
			dateFormat,
			dateFormatSeparator
		);
	} else if (calculationType === GeneralCalculation.COUNT_VALUES) {
		return countValues(columnCells, cellType);
	} else if (calculationType === GeneralCalculation.PERCENT_EMPTY) {
		return percentEmpty(columnCells, cellType);
	} else if (calculationType === GeneralCalculation.PERCENT_NOT_EMPTY) {
		return percentNotEmpty(columnCells, cellType);
	} else if (calculationType === GeneralCalculation.NONE) {
		return "";
	} else {
		throw new Error("Unhandled calculation type");
	}
};

const countAll = (rows: Row[]) => {
	return rows.length;
};

const countEmpty = (columnCells: Cell[], cellType: CellType) => {
	return columnCells
		.map((cell) => isCellEmpty(cell, cellType))
		.reduce((accum, value) => {
			if (value === true) return accum + 1;
			return accum;
		}, 0);
};

const countNotEmpty = (columnCells: Cell[], type: CellType) => {
	return columnCells
		.map((cell) => isCellEmpty(cell, type))
		.reduce((accum, value) => {
			if (value === false) return accum + 1;
			return accum;
		}, 0);
};

const countUnique = (
	sources: Source[],
	rows: Row[],
	columnCells: Cell[],
	columnTags: Tag[],
	cellType: CellType,
	dateFormat: DateFormat,
	dateFormatSeparator: DateFormatSeparator
) => {
	const hashes = columnCells
		.map((cell) => {
			const row = rows.find((row) => {
				const { cells } = row;
				return cells.find((c) => c.id === cell.id);
			});
			if (!row) throw new RowNotFoundError();

			const source =
				sources.find((source) => source.id === row.sourceId) ?? null;

			const cellValues = getCellValues(
				cell,
				cellType,
				dateFormat,
				dateFormatSeparator,
				row,
				source,
				columnTags
			);
			return cellValues
				.filter((value) => value !== "")
				.map((value) => hashString(value));
		})
		.flat(1);
	const uniqueHashes = new Set(hashes);
	return uniqueHashes.size;
};

const countValues = (columnCells: Cell[], cellType: CellType) => {
	return columnCells
		.map((cell) => countCellValues(cell, cellType))
		.reduce((accum, value) => accum + value, 0);
};

const percentEmpty = (columnCells: Cell[], cellType: CellType) => {
	if (columnCells.length === 0) return "0%";

	const percent =
		(countEmpty(columnCells, cellType) / columnCells.length) * 100;
	return round2Digits(percent) + "%";
};

const percentNotEmpty = (columnCells: Cell[], cellType: CellType) => {
	if (columnCells.length === 0) return "0%";

	const percent =
		(countNotEmpty(columnCells, cellType) / columnCells.length) * 100;
	return round2Digits(percent) + "%";
};

const getCellValues = (
	cell: Cell,
	type: CellType,
	dateFormat: DateFormat,
	dateFormatSeparator: DateFormatSeparator,
	row: Row,
	source: Source | null,
	columnTags: Tag[]
): string[] => {
	const { creationDateTime, lastEditedDateTime } = row;
	switch (type) {
		case CellType.TEXT: {
			const { content } = cell as TextCell;
			return [content];
		}
		case CellType.EMBED: {
			const { pathOrUrl } = cell as EmbedCell;
			return [pathOrUrl];
		}
		case CellType.NUMBER: {
			const { value } = cell as NumberCell;
			if (value) return [value.toString()];
			return [];
		}
		case CellType.FILE: {
			const { path } = cell as FileCell;
			const fileName = getFileNameFromPath(path);
			return [fileName];
		}
		case CellType.SOURCE_FILE: {
			const { path } = cell as SourceFileCell;
			const fileName = getFileNameFromPath(path);
			return [fileName];
		}
		case CellType.CHECKBOX: {
			const { value } = cell as CheckboxCell;
			return [value ? "true" : "false"];
		}
		case CellType.DATE: {
			const { dateTime } = cell as DateCell;
			if (dateTime) return [dateTime.toString()];
			return [];
		}
		case CellType.TAG: {
			const { tagId } = cell as TagCell;
			if (tagId) {
				const tag = columnTags.find((tag) => tag.id === tagId);
				if (!tag) throw new TagNotFoundError(tagId);
				const { content } = tag;
				return [content];
			}
			return [];
		}
		case CellType.MULTI_TAG: {
			const { tagIds } = cell as MultiTagCell;
			return tagIds.map((tagId) => {
				const tag = columnTags.find((tag) => tag.id === tagId);
				if (!tag) throw new TagNotFoundError(tagId);
				const { content } = tag;
				return content;
			});
		}
		case CellType.LAST_EDITED_TIME: {
			return [
				dateTimeToDateString(
					lastEditedDateTime,
					dateFormat,
					dateFormatSeparator,
					{
						includeTime: true,
					}
				),
			];
		}
		case CellType.CREATION_TIME: {
			return [
				dateTimeToDateString(
					creationDateTime,
					dateFormat,
					dateFormatSeparator,
					{
						includeTime: true,
					}
				),
			];
		}
		case CellType.SOURCE: {
			return [getSourceCellContent(source)];
		}
		default:
			throw new Error("Unhandled cell type");
	}
};

const countCellValues = (cell: Cell, type: CellType): number => {
	switch (type) {
		case CellType.TEXT: {
			const { content } = cell as TextCell;
			return content === "" ? 0 : 1;
		}
		case CellType.EMBED: {
			const { pathOrUrl } = cell as EmbedCell;
			return pathOrUrl === "" ? 0 : 1;
		}

		case CellType.NUMBER: {
			const { value } = cell as NumberCell;
			return value === null ? 0 : 1;
		}
		case CellType.FILE: {
			const { path } = cell as FileCell;
			return path === "" ? 0 : 1;
		}
		case CellType.SOURCE_FILE: {
			const { path } = cell as SourceFileCell;
			return path === "" ? 0 : 1;
		}
		case CellType.CHECKBOX: {
			const { value } = cell as CheckboxCell;
			return value ? 1 : 0;
		}
		case CellType.DATE: {
			const { dateTime } = cell as DateCell;
			return dateTime == null ? 0 : 1;
		}

		case CellType.TAG: {
			const { tagId } = cell as TagCell;
			return tagId === null ? 0 : 1;
		}

		case CellType.MULTI_TAG: {
			const { tagIds } = cell as MultiTagCell;
			return tagIds.length;
		}
		case CellType.LAST_EDITED_TIME: {
			return 1;
		}
		case CellType.CREATION_TIME: {
			return 1;
		}
		case CellType.SOURCE: {
			return 1;
		}
		default:
			throw new Error("Unhandled cell type");
	}
};

const isCellEmpty = (cell: Cell, type: CellType): boolean => {
	switch (type) {
		case CellType.TEXT: {
			const { content } = cell as TextCell;
			return content === "";
		}
		case CellType.EMBED: {
			const { pathOrUrl } = cell as EmbedCell;
			return pathOrUrl === "";
		}
		case CellType.NUMBER: {
			const { value } = cell as NumberCell;
			return value === null;
		}
		case CellType.FILE: {
			const { path } = cell as FileCell;
			return path === "";
		}
		case CellType.SOURCE_FILE: {
			const { path } = cell as FileCell;
			return path === "";
		}
		case CellType.DATE: {
			const { dateTime } = cell as DateCell;
			return dateTime == null;
		}
		case CellType.TAG: {
			const { tagId } = cell as TagCell;
			return tagId === null;
		}
		case CellType.MULTI_TAG: {
			const { tagIds } = cell as MultiTagCell;
			return tagIds.length === 0;
		}
		case CellType.CHECKBOX: {
			const { value } = cell as CheckboxCell;
			return value === false;
		}
		case CellType.SOURCE: {
			return false;
		}
		case CellType.LAST_EDITED_TIME: {
			return true;
		}
		case CellType.CREATION_TIME: {
			return true;
		}
		default:
			throw new Error("Unhandled cell type");
	}
};
