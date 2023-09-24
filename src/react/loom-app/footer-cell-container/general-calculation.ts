import { isCheckboxChecked } from "src/shared/match";
import {
	Cell,
	Row,
	GeneralCalculation,
	CalculationType,
	CellType,
	DateFormat,
	Tag,
} from "src/shared/loom-state/types/loom-state";
import { hashString, round2Digits } from "./utils";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import TagNotFoundError from "src/shared/error/tag-not-found-error";
import { unixTimeToDateTimeString } from "src/shared/date/date-conversion";

export const getGeneralCalculationContent = (
	columnId: string,
	rows: Row[],
	columnTags: Tag[],
	cellType: CellType,
	calculationType: CalculationType,
	dateFormat: DateFormat
) => {
	const columnCells = rows.map((row) => {
		const cell = row.cells.find((cell) => cell.columnId === columnId);
		if (!cell) throw new RowNotFoundError(row.id);
		return cell;
	});
	return getCalculation(
		columnCells,
		rows,
		columnTags,
		cellType,
		calculationType,
		dateFormat
	).toString();
};

const getCalculation = (
	columnCells: Cell[],
	rows: Row[],
	columnTags: Tag[],
	cellType: CellType,
	calculationType: CalculationType,
	dateFormat: DateFormat
) => {
	if (calculationType === GeneralCalculation.COUNT_ALL) {
		return countAll(rows);
	} else if (calculationType === GeneralCalculation.COUNT_EMPTY) {
		return countEmpty(columnCells, cellType);
	} else if (calculationType === GeneralCalculation.COUNT_NOT_EMPTY) {
		return countNotEmpty(columnCells, cellType);
	} else if (calculationType === GeneralCalculation.COUNT_UNIQUE) {
		return countUnique(rows, columnCells, columnTags, cellType, dateFormat);
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
		.map((cell) => isCellContentEmpty(cell, cellType))
		.reduce((accum, value) => {
			if (value === true) return accum + 1;
			return accum;
		}, 0);
};

const countNotEmpty = (columnCells: Cell[], cellType: CellType) => {
	return columnCells
		.map((cell) => isCellContentEmpty(cell, cellType))
		.reduce((accum, value) => {
			if (value === false) return accum + 1;
			return accum;
		}, 0);
};

const countUnique = (
	rows: Row[],
	columnCells: Cell[],
	columnTags: Tag[],
	cellType: CellType,
	dateFormat: DateFormat
) => {
	const hashes = columnCells
		.map((cell) => {
			const row = rows.find((row) =>
				row.cells.find((cell) => cell.id === cell.id)
			);
			if (!row) throw new RowNotFoundError();

			const cellValues = getCellValues(
				row,
				cell,
				columnTags,
				cellType,
				dateFormat
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
	row: Row,
	cell: Cell,
	columnTags: Tag[],
	cellType: CellType,
	dateFormat: DateFormat
): string[] => {
	const { content, dateTime, tagIds } = cell;
	const { creationTime, lastEditedTime } = row;
	if (
		cellType === CellType.TEXT ||
		cellType === CellType.EMBED ||
		cellType === CellType.NUMBER ||
		cellType === CellType.CHECKBOX ||
		cellType === CellType.FILE
	) {
		return [content];
	} else if (cellType === CellType.DATE) {
		if (dateTime) return [dateTime.toString()];
		return [];
	} else if (cellType === CellType.TAG || cellType === CellType.MULTI_TAG) {
		return tagIds.map((tagId) => {
			const tag = columnTags.find((tag) => tag.id === tagId);
			if (!tag) throw new TagNotFoundError(tagId);
			const { content } = tag;
			return content;
		});
	} else if (cellType === CellType.LAST_EDITED_TIME) {
		return [unixTimeToDateTimeString(lastEditedTime, dateFormat)];
	} else if (cellType === CellType.CREATION_TIME) {
		return [unixTimeToDateTimeString(creationTime, dateFormat)];
	} else {
		throw new Error("Unhandled cell type");
	}
};

const countCellValues = (cell: Cell, cellType: CellType): number => {
	const { content, dateTime, tagIds } = cell;
	if (
		cellType === CellType.TEXT ||
		cellType === CellType.EMBED ||
		cellType === CellType.NUMBER ||
		cellType === CellType.FILE
	) {
		return content === "" ? 0 : 1;
	} else if (cellType === CellType.DATE) {
		return dateTime == null ? 0 : 1;
	} else if (cellType === CellType.TAG || cellType === CellType.MULTI_TAG) {
		return tagIds.length;
	} else if (cellType === CellType.CHECKBOX) {
		return isCheckboxChecked(content) ? 1 : 0;
	} else if (
		cellType === CellType.LAST_EDITED_TIME ||
		cellType === CellType.CREATION_TIME
	) {
		return 1;
	} else {
		throw new Error("Unhandled cell type");
	}
};

const isCellContentEmpty = (cell: Cell, cellType: CellType): boolean => {
	const { content, dateTime, tagIds } = cell;
	if (
		cellType === CellType.TEXT ||
		cellType === CellType.EMBED ||
		cellType === CellType.NUMBER ||
		cellType === CellType.FILE
	) {
		return content === "";
	} else if (cellType === CellType.DATE) {
		return dateTime == null;
	} else if (cellType === CellType.TAG || cellType === CellType.MULTI_TAG) {
		return tagIds.length === 0;
	} else if (cellType === CellType.CHECKBOX) {
		return !isCheckboxChecked(content);
	} else if (
		cellType === CellType.LAST_EDITED_TIME ||
		cellType === CellType.CREATION_TIME
	) {
		return true;
	} else {
		throw new Error("Unhandled cell type");
	}
};
