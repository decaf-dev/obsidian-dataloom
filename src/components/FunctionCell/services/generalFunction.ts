import { isCheckboxChecked } from "src/services/string/validators";
import {
	BodyCell,
	BodyRow,
	CellType,
	GeneralFunction,
} from "src/services/tableState/types";
import { normalizeDecimal } from "./utils";

export const getGeneralFunctionContent = (
	bodyRows: BodyRow[],
	columnCells: BodyCell[],
	cellType: CellType,
	functionType: GeneralFunction
) => {
	return getGeneralFunctionValue(
		bodyRows,
		columnCells,
		cellType,
		functionType
	).toString();
};

const getGeneralFunctionValue = (
	bodyRows: BodyRow[],
	columnCells: BodyCell[],
	cellType: CellType,
	functionType: GeneralFunction
) => {
	if (functionType === GeneralFunction.COUNT_ALL) {
		return countAll(bodyRows);
	} else if (functionType === GeneralFunction.COUNT_EMPTY) {
		return countEmpty(columnCells, cellType);
	} else if (functionType === GeneralFunction.COUNT_NOT_EMPTY) {
		return countNotEmpty(columnCells, cellType);
	} else if (functionType === GeneralFunction.COUNT_UNIQUE) {
		return countUnique(columnCells, cellType);
	} else if (functionType === GeneralFunction.COUNT_VALUES) {
		return countValues(columnCells, cellType);
	} else if (functionType === GeneralFunction.PERCENT_EMPTY) {
		return percentEmpty(columnCells, cellType);
	} else if (functionType === GeneralFunction.PERCENT_NOT_EMPTY) {
		return percentNotEmpty(columnCells, cellType);
	} else if (functionType === GeneralFunction.NONE) {
		return "";
	} else {
		throw new Error("Unhandled general function");
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

const countUnique = (columnCells: BodyCell[], cellType: CellType) => {
	//TODO unique
	return columnCells
		.map((cell) => countUniqueCellValues(cell, cellType))
		.reduce((accum, value) => accum + value, 0);
};

const countValues = (columnCells: BodyCell[], cellType: CellType) => {
	return columnCells
		.map((cell) => countCellValues(cell, cellType))
		.reduce((accum, value) => accum + value, 0);
};

const percentEmpty = (columnCells: BodyCell[], cellType: CellType) => {
	const percent =
		(countEmpty(columnCells, cellType) / columnCells.length) * 100;
	const normalized = normalizeDecimal(percent);
	return normalized + "%";
};

const percentNotEmpty = (columnCells: BodyCell[], cellType: CellType) => {
	const percent =
		(countNotEmpty(columnCells, cellType) / columnCells.length) * 100;
	const normalized = normalizeDecimal(percent);
	return normalized + "%";
};

const countUniqueCellValues = (cell: BodyCell, cellType: CellType) => {
	//TODO unique
	return 1;
};

const countCellValues = (cell: BodyCell, cellType: CellType) => {
	if (
		cellType === CellType.TEXT ||
		cellType === CellType.NUMBER ||
		cellType === CellType.CURRENCY
	) {
		return cell.markdown === "" ? 0 : 1;
	} else if (cellType === CellType.DATE) {
		return cell.dateTime == null ? 0 : 1;
	} else if (cellType === CellType.TAG || cellType === CellType.MULTI_TAG) {
		//TODO do tags
		return 0;
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

const isCellContentEmpty = (cell: BodyCell, cellType: CellType) => {
	if (
		cellType === CellType.TEXT ||
		cellType === CellType.NUMBER ||
		cellType === CellType.CURRENCY
	) {
		return cell.markdown === "";
	} else if (cellType === CellType.DATE) {
		return cell.dateTime == null;
	} else if (cellType === CellType.TAG || cellType === CellType.MULTI_TAG) {
		//TODO do tags
	} else if (cellType === CellType.CHECKBOX) {
		if (isCheckboxChecked(cell.markdown)) return false;
		return true;
	} else if (
		cellType === CellType.LAST_EDITED_TIME ||
		cellType === CellType.CREATION_TIME
	) {
		return true;
	} else {
		throw new Error("Unhandled cell type");
	}
};
