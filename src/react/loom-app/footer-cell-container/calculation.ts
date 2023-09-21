import { isCheckboxChecked } from "src/shared/match";
import {
	BodyCell,
	BodyRow,
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

export const getCalculationContent = (
	bodyRows: BodyRow[],
	columnCells: BodyCell[],
	columnTags: Tag[],
	cellType: CellType,
	calculationType: CalculationType,
	dateFormat: DateFormat
) => {
	return getCalculation(
		bodyRows,
		columnCells,
		columnTags,
		cellType,
		calculationType,
		dateFormat
	).toString();
};

export const getCalculation = (
	bodyRows: BodyRow[],
	columnCells: BodyCell[],
	columnTags: Tag[],
	cellType: CellType,
	calculationType: CalculationType,
	dateFormat: DateFormat
) => {
	if (calculationType === GeneralCalculation.COUNT_ALL) {
		return countAll(bodyRows);
	} else if (calculationType === GeneralCalculation.COUNT_EMPTY) {
		return countEmpty(columnCells, cellType);
	} else if (calculationType === GeneralCalculation.COUNT_NOT_EMPTY) {
		return countNotEmpty(columnCells, cellType);
	} else if (calculationType === GeneralCalculation.COUNT_UNIQUE) {
		return countUnique(
			bodyRows,
			columnCells,
			columnTags,
			cellType,
			dateFormat
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

const countAll = (bodyRows: BodyRow[]) => {
	return bodyRows.length;
};

const countEmpty = (columnCells: BodyCell[], cellType: CellType) => {
	return columnCells
		.map((cell) => isCellContentEmpty(cell, cellType))
		.reduce((accum, value) => {
			if (value === true) return accum + 1;
			return accum;
		}, 0);
};

const countNotEmpty = (columnCells: BodyCell[], cellType: CellType) => {
	return columnCells
		.map((cell) => isCellContentEmpty(cell, cellType))
		.reduce((accum, value) => {
			if (value === false) return accum + 1;
			return accum;
		}, 0);
};

const countUnique = (
	bodyRows: BodyRow[],
	columnCells: BodyCell[],
	columnTags: Tag[],
	cellType: CellType,
	dateFormat: DateFormat
) => {
	const hashes = columnCells
		.map((cell) => {
			const row = bodyRows.find((row) => row.id === cell.rowId);
			if (!row) throw new RowNotFoundError(cell.rowId);

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

const countValues = (columnCells: BodyCell[], cellType: CellType) => {
	return columnCells
		.map((cell) => countCellValues(cell, cellType))
		.reduce((accum, value) => accum + value, 0);
};

const percentEmpty = (columnCells: BodyCell[], cellType: CellType) => {
	if (columnCells.length === 0) return "0%";

	const percent =
		(countEmpty(columnCells, cellType) / columnCells.length) * 100;
	return round2Digits(percent) + "%";
};

const percentNotEmpty = (columnCells: BodyCell[], cellType: CellType) => {
	if (columnCells.length === 0) return "0%";

	const percent =
		(countNotEmpty(columnCells, cellType) / columnCells.length) * 100;
	return round2Digits(percent) + "%";
};

const getCellValues = (
	bodyRow: BodyRow,
	cell: BodyCell,
	columnTags: Tag[],
	cellType: CellType,
	dateFormat: DateFormat
): string[] => {
	if (
		cellType === CellType.TEXT ||
		cellType === CellType.EMBED ||
		cellType === CellType.NUMBER ||
		cellType === CellType.CHECKBOX ||
		cellType === CellType.FILE
	) {
		return [cell.markdown];
	} else if (cellType === CellType.DATE) {
		if (cell.dateTime) return [cell.dateTime.toString()];
		return [];
	} else if (cellType === CellType.TAG || cellType === CellType.MULTI_TAG) {
		return cell.tagIds.map((tagId) => {
			const tag = columnTags.find((tag) => tag.id === tagId);
			if (!tag) throw new TagNotFoundError(tagId);
			return tag.markdown;
		});
	} else if (cellType === CellType.LAST_EDITED_TIME) {
		return [unixTimeToDateTimeString(bodyRow.lastEditedTime, dateFormat)];
	} else if (cellType === CellType.CREATION_TIME) {
		return [unixTimeToDateTimeString(bodyRow.creationTime, dateFormat)];
	} else {
		throw new Error("Unhandled cell type");
	}
};

const countCellValues = (cell: BodyCell, cellType: CellType): number => {
	if (
		cellType === CellType.TEXT ||
		cellType === CellType.EMBED ||
		cellType === CellType.NUMBER ||
		cellType === CellType.FILE
	) {
		return cell.markdown === "" ? 0 : 1;
	} else if (cellType === CellType.DATE) {
		return cell.dateTime == null ? 0 : 1;
	} else if (cellType === CellType.TAG || cellType === CellType.MULTI_TAG) {
		return cell.tagIds.length;
	} else if (cellType === CellType.CHECKBOX) {
		return isCheckboxChecked(cell.markdown) ? 1 : 0;
	} else if (
		cellType === CellType.LAST_EDITED_TIME ||
		cellType === CellType.CREATION_TIME
	) {
		return 1;
	} else {
		throw new Error("Unhandled cell type");
	}
};

const isCellContentEmpty = (cell: BodyCell, cellType: CellType): boolean => {
	if (
		cellType === CellType.TEXT ||
		cellType === CellType.EMBED ||
		cellType === CellType.NUMBER ||
		cellType === CellType.FILE
	) {
		return cell.markdown === "";
	} else if (cellType === CellType.DATE) {
		return cell.dateTime == null;
	} else if (cellType === CellType.TAG || cellType === CellType.MULTI_TAG) {
		return cell.tagIds.length === 0;
	} else if (cellType === CellType.CHECKBOX) {
		return !isCheckboxChecked(cell.markdown);
	} else if (
		cellType === CellType.LAST_EDITED_TIME ||
		cellType === CellType.CREATION_TIME
	) {
		return true;
	} else {
		throw new Error("Unhandled cell type");
	}
};
