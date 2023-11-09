import { isCheckboxChecked } from "src/shared/match";
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
} from "src/shared/loom-state/types/loom-state";
import { hashString, round2Digits } from "./utils";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import TagNotFoundError from "src/shared/error/tag-not-found-error";
import { dateTimeToDateString } from "src/shared/date/date-conversion";
import { getSourceCellContent } from "src/shared/cell-content/source-cell-content";
import { getColumnCells } from "src/shared/loom-state/utils/column-utils";

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
	const { content, dateTime, tagIds } = cell;
	const { creationDateTime, lastEditedDateTime } = row;
	if (
		type === CellType.TEXT ||
		type === CellType.EMBED ||
		type === CellType.NUMBER ||
		type === CellType.CHECKBOX ||
		type === CellType.FILE ||
		type === CellType.SOURCE_FILE
	) {
		return [content];
	} else if (type === CellType.DATE) {
		if (dateTime) return [dateTime.toString()];
		return [];
	} else if (type === CellType.TAG || type === CellType.MULTI_TAG) {
		return tagIds.map((tagId) => {
			const tag = columnTags.find((tag) => tag.id === tagId);
			if (!tag) throw new TagNotFoundError(tagId);
			const { content } = tag;
			return content;
		});
	} else if (type === CellType.LAST_EDITED_TIME) {
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
	} else if (type === CellType.CREATION_TIME) {
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
	} else if (type === CellType.SOURCE) {
		return [getSourceCellContent(source)];
	} else {
		throw new Error("Unhandled cell type");
	}
};

const countCellValues = (cell: Cell, type: CellType): number => {
	const { content, dateTime, tagIds } = cell;
	if (
		type === CellType.TEXT ||
		type === CellType.EMBED ||
		type === CellType.NUMBER ||
		type === CellType.FILE ||
		type === CellType.SOURCE_FILE
	) {
		return content === "" ? 0 : 1;
	} else if (type === CellType.DATE) {
		return dateTime == null ? 0 : 1;
	} else if (type === CellType.TAG || type === CellType.MULTI_TAG) {
		return tagIds.length;
	} else if (type === CellType.CHECKBOX) {
		return isCheckboxChecked(content) ? 1 : 0;
	} else if (
		type === CellType.LAST_EDITED_TIME ||
		type === CellType.CREATION_TIME
	) {
		return 1;
	} else if (type === CellType.SOURCE) {
		return 1;
	} else {
		throw new Error("Unhandled cell type");
	}
};

const isCellEmpty = (cell: Cell, type: CellType): boolean => {
	const { content, dateTime, tagIds } = cell;
	if (
		type === CellType.TEXT ||
		type === CellType.EMBED ||
		type === CellType.NUMBER ||
		type === CellType.FILE ||
		type === CellType.SOURCE_FILE
	) {
		return content === "";
	} else if (type === CellType.DATE) {
		return dateTime == null;
	} else if (type === CellType.TAG || type === CellType.MULTI_TAG) {
		return tagIds.length === 0;
	} else if (type === CellType.CHECKBOX) {
		return !isCheckboxChecked(content);
	} else if (
		type === CellType.LAST_EDITED_TIME ||
		type === CellType.CREATION_TIME
	) {
		return true;
	} else if (type === CellType.SOURCE) {
		return false;
	} else {
		throw new Error("Unhandled cell type");
	}
};
