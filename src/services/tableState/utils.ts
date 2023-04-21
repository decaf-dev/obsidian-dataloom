import {
	CellType,
	CurrencyType,
	DateFormat,
	FunctionType,
	GeneralFunction,
	NumberFunction,
} from "./types";

export const getDisplayNameForFunctionType = (value: FunctionType) => {
	if (Object.values(GeneralFunction).includes(value as GeneralFunction)) {
		switch (value) {
			case GeneralFunction.COUNT_ALL:
				return "Count";
			case GeneralFunction.COUNT_NOT_EMPTY:
				return "Not empty";
			case GeneralFunction.COUNT_VALUES:
				return "Values";
			case GeneralFunction.COUNT_EMPTY:
				return "Empty";
			case GeneralFunction.COUNT_UNIQUE:
				return "Unique";
			case GeneralFunction.NONE:
				return "None";
			case GeneralFunction.PERCENT_EMPTY:
				return "Empty";
			case GeneralFunction.PERCENT_NOT_EMPTY:
				return "Not empty";
			default:
				return "";
		}
	} else {
		return getDisplayNameForNumberFunction(value as NumberFunction);
	}
};

export const getAriaLabelForGeneralFunction = (value: GeneralFunction) => {
	switch (value) {
		case GeneralFunction.COUNT_ALL:
			return "Counts the total number of rows";
		case GeneralFunction.COUNT_EMPTY:
			return "Counts the number of rows with an empty cell value";
		case GeneralFunction.COUNT_NOT_EMPTY:
			return "Counts the number of rows with a non-empty cell value";
		case GeneralFunction.COUNT_UNIQUE:
			return "Counts the number of unique values in the column";
		case GeneralFunction.COUNT_VALUES:
			return "Counts the number of values in the column";
		case GeneralFunction.PERCENT_EMPTY:
			return "Displays the percentage of rows with an empty cell value";
		case GeneralFunction.PERCENT_NOT_EMPTY:
			return "Displays the percentage of rows with a non-empty cell value";
		default:
			return "";
	}
};

export const getAriaLabelForNumberFunction = (value: NumberFunction) => {
	switch (value) {
		case NumberFunction.SUM:
			return "Computes the sum of the cells in the column";
		case NumberFunction.AVG:
			return "Computes the average of the cells in the column";
		case NumberFunction.MIN:
			return "Computes the minimum of the cells in the column";
		case NumberFunction.MAX:
			return "Computes the maximum of the cells in the column";
		case NumberFunction.MEDIAN:
			return "Computes the median of the cells in the column";
		case NumberFunction.RANGE:
			return "Computes the range (max - min) of the cells in the column";
		default:
			return "";
	}
};

export const getDisplayNameForGeneralFunction = (value: GeneralFunction) => {
	switch (value) {
		case GeneralFunction.COUNT_ALL:
			return "Count all";
		case GeneralFunction.COUNT_NOT_EMPTY:
			return "Count not empty";
		case GeneralFunction.COUNT_VALUES:
			return "Count values";
		case GeneralFunction.COUNT_EMPTY:
			return "Count empty";
		case GeneralFunction.COUNT_UNIQUE:
			return "Count unique";
		case GeneralFunction.NONE:
			return "None";
		case GeneralFunction.PERCENT_EMPTY:
			return "Percent empty";
		case GeneralFunction.PERCENT_NOT_EMPTY:
			return "Percent not empty";
		default:
			return "";
	}
};

export const getDisplayNameForNumberFunction = (value: NumberFunction) => {
	switch (value) {
		case NumberFunction.SUM:
			return "Sum";
		case NumberFunction.AVG:
			return "Average";
		case NumberFunction.MIN:
			return "Min";
		case NumberFunction.MAX:
			return "Max";
		case NumberFunction.MEDIAN:
			return "Median";
		case NumberFunction.RANGE:
			return "Range";
		default:
			return "";
	}
};

export const getDisplayNameForDateFormat = (format: DateFormat) => {
	switch (format) {
		case DateFormat.DD_MM_YYYY:
			return "Day/Month/Year";
		case DateFormat.MM_DD_YYYY:
			return "Month/Day/Year";
		case DateFormat.YYYY_MM_DD:
			return "Year/Month/Day";
		case DateFormat.FULL:
			return "Full";
		case DateFormat.RELATIVE:
			return "Relative";
		default:
			return "";
	}
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
