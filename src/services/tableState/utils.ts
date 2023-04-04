import { isCheckbox, isNumber, isDate } from "../string/validators";
import { Cell, CellType, Column, Row } from "./types";

//TODO change
export const sortCells = (
	columns: Column[],
	rows: Row[],
	cells: Cell[]
): Cell[] => {
	return (
		//Get the cell rows in order
		rows
			.map((row) => {
				return cells.filter((c) => c.rowId === row.id);
			})
			//Sort each row based on the order of the column ids
			.map((row) => {
				return row.sort((a, b) => {
					const indexA = columns.findIndex(
						(column) => column.id === a.columnId
					);
					const indexB = columns.findIndex(
						(column) => column.id === b.columnId
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
