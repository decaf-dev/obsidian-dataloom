import { isCheckboxChecked } from "src/shared/validators";
import {
	BodyCell,
	BodyRow,
	CellType,
	DateFormat,
	GeneralFunction,
	Tag,
} from "src/shared/types/types";
import { hashString, round2Digits } from "./utils";
import {
	RowIdError,
	TagNotFoundError,
} from "src/shared/table-state/table-error";
import { unixTimeToDateTimeString } from "src/shared/date/date-conversion";

export const getGeneralFunctionContent = (
	bodyRows: BodyRow[],
	columnCells: BodyCell[],
	columnTags: Tag[],
	cellType: CellType,
	functionType: GeneralFunction,
	dateFormat: DateFormat
) => {
	return getGeneralFunctionValue(
		bodyRows,
		columnCells,
		columnTags,
		cellType,
		functionType,
		dateFormat
	).toString();
};

const getGeneralFunctionValue = (
	bodyRows: BodyRow[],
	columnCells: BodyCell[],
	columnTags: Tag[],
	cellType: CellType,
	functionType: GeneralFunction,
	dateFormat: DateFormat
) => {
	if (functionType === GeneralFunction.COUNT_ALL) {
		return countAll(bodyRows);
	} else if (functionType === GeneralFunction.COUNT_EMPTY) {
		return countEmpty(columnCells, columnTags, cellType);
	} else if (functionType === GeneralFunction.COUNT_NOT_EMPTY) {
		return countNotEmpty(columnCells, columnTags, cellType);
	} else if (functionType === GeneralFunction.COUNT_UNIQUE) {
		return countUnique(
			bodyRows,
			columnCells,
			columnTags,
			cellType,
			dateFormat
		);
	} else if (functionType === GeneralFunction.COUNT_VALUES) {
		return countValues(columnCells, columnTags, cellType);
	} else if (functionType === GeneralFunction.PERCENT_EMPTY) {
		return percentEmpty(columnCells, columnTags, cellType);
	} else if (functionType === GeneralFunction.PERCENT_NOT_EMPTY) {
		return percentNotEmpty(columnCells, columnTags, cellType);
	} else if (functionType === GeneralFunction.NONE) {
		return "";
	} else {
		throw new Error("Unhandled general function");
	}
};

const countAll = (bodyRows: BodyRow[]) => {
	return bodyRows.length;
};

const countEmpty = (
	columnCells: BodyCell[],
	columnTags: Tag[],
	cellType: CellType
) => {
	return columnCells
		.map((cell) => isCellContentEmpty(cell, columnTags, cellType))
		.reduce((accum, value) => {
			if (value === true) return accum + 1;
			return accum;
		}, 0);
};

const countNotEmpty = (
	columnCells: BodyCell[],
	columnTags: Tag[],
	cellType: CellType
) => {
	return columnCells
		.map((cell) => isCellContentEmpty(cell, columnTags, cellType))
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
			if (!row) throw new RowIdError(cell.rowId);

			const cellValues = getCellValues(
				row,
				cell,
				columnTags,
				cellType,
				dateFormat
			);
			return cellValues.map((value) => hashString(value));
		})
		.flat(1);
	const uniqueHashes = new Set(hashes);
	return uniqueHashes.size;
};

const countValues = (
	columnCells: BodyCell[],
	columnTags: Tag[],
	cellType: CellType
) => {
	return columnCells
		.map((cell) => countCellValues(cell, columnTags, cellType))
		.reduce((accum, value) => accum + value, 0);
};

const percentEmpty = (
	columnCells: BodyCell[],
	columnTags: Tag[],
	cellType: CellType
) => {
	const percent =
		(countEmpty(columnCells, columnTags, cellType) / columnCells.length) *
		100;
	const normalized = round2Digits(percent);
	return normalized + "%";
};

const percentNotEmpty = (
	columnCells: BodyCell[],
	columnTags: Tag[],
	cellType: CellType
) => {
	const percent =
		(countNotEmpty(columnCells, columnTags, cellType) /
			columnCells.length) *
		100;
	const normalized = round2Digits(percent);
	return normalized + "%";
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
		cellType === CellType.NUMBER ||
		cellType === CellType.CURRENCY ||
		cellType === CellType.CHECKBOX
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

const countCellValues = (
	cell: BodyCell,
	columnTags: Tag[],
	cellType: CellType
): number => {
	if (
		cellType === CellType.TEXT ||
		cellType === CellType.NUMBER ||
		cellType === CellType.CURRENCY
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

const isCellContentEmpty = (
	cell: BodyCell,
	columnTags: Tag[],
	cellType: CellType
): boolean => {
	if (
		cellType === CellType.TEXT ||
		cellType === CellType.NUMBER ||
		cellType === CellType.CURRENCY
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
