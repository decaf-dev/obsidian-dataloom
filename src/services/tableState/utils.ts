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

export const getDisplayNameForCellType = (type: CellType): string => {
	switch (type) {
		case CellType.TEXT:
			return "Text";
		case CellType.NUMBER:
			return "Number";
		case CellType.CHECKBOX:
			return "Checkbox";
		case CellType.DATE:
			return "Date";
		case CellType.LAST_EDITED_TIME:
			return "Last edited";
		case CellType.CREATION_TIME:
			return "Creation";
		case CellType.TAG:
			return "Tag";
		case CellType.MULTI_TAG:
			return "Multi-tag";
		case CellType.CURRENCY:
			return "Currency";
		default:
			return "";
	}
};
