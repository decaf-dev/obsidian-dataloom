import { Cell, CellType, Column, CurrencyType, Row } from "./types";

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

export const getDisplayNameForCurrencyType = (type: CurrencyType) => {
	switch (type) {
		case CurrencyType.UNITED_STATES:
			return "United States Dollar";
		case CurrencyType.CANADA:
			return "Canadian Dollar";
		case CurrencyType.AUSTRALIA:
			return "Australian Dollar";
		case CurrencyType.SINGAPORE:
			return "Singapore Dollar";
		case CurrencyType.CHINA:
			return "Yuan";
		case CurrencyType.JAPAN:
			return "Yen";
		case CurrencyType.COLOMBIA:
			return "Colombian Peso";
		case CurrencyType.EUROPE:
			return "Euro";
		case CurrencyType.BRAZIL:
			return "Real";
		case CurrencyType.POUND:
			return "Pound";
		case CurrencyType.INDIA:
			return "Rupee";
		case CurrencyType.ARGENTINA:
			return "Argentine Peso";
		case CurrencyType.MEXICO:
			return "Mexican Peso";
		case CurrencyType.RUSSIA:
			return "Ruble";
		default:
			return "";
	}
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
