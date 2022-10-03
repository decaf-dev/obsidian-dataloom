import { NUMBER_REGEX } from "../string/regex";
import { isCheckbox, isNumber, isDate } from "../string/validators";
import { Cell, CellType } from "./types";
import type { MarkdownViewModeType } from "obsidian";

export const sortCells = (
	rowIds: string[],
	columnIds: string[],
	cells: Cell[]
): Cell[] => {
	return (
		//Get the cell rows in order
		rowIds
			.map((id) => {
				return cells.filter((c) => c.rowId === id);
			})
			//Sort each row based on the order of the column ids
			.map((row) => {
				return row.sort((a, b) => {
					const indexA = columnIds.findIndex(
						(id) => id === a.columnId
					);
					const indexB = columnIds.findIndex(
						(id) => id === b.columnId
					);
					return indexA - indexB;
				});
			})
			//Return a flatten version of the array
			.flat(1)
	);
};

export const isValidCellContent = (
	content: string,
	cellType: CellType
): boolean => {
	switch (cellType) {
		case CellType.NUMBER:
			return isNumber(content);
		case CellType.DATE:
			return isDate(content);
		case CellType.CHECKBOX:
			return isCheckbox(content);
		default:
			return false;
	}
};

export const filterNumberFromContent = (content: string) => {
	let result = "";
	for (let i = 0; i < content.length; i++) {
		if (content[i].match(NUMBER_REGEX)) result += content[i];
	}
	return result;
};

export const getUniqueTableId = (
	tableId: string,
	viewMode: MarkdownViewModeType
) => {
	return "NLT_" + tableId + "-" + viewMode;
};
