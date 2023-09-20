import { isNumberCalcuation } from "../match";
import {
	GeneralCalculation,
	CalculationType,
	CellType,
	CurrencyType,
	DateFormat,
	NumberCalculation,
} from "./types/loom-state";

const getShortDisplayNameForCalculation = (value: GeneralCalculation) => {
	switch (value) {
		case GeneralCalculation.COUNT_ALL:
			return "Count";
		case GeneralCalculation.COUNT_NOT_EMPTY:
			return "Not empty";
		case GeneralCalculation.COUNT_VALUES:
			return "Values";
		case GeneralCalculation.COUNT_EMPTY:
			return "Empty";
		case GeneralCalculation.COUNT_UNIQUE:
			return "Unique";
		case GeneralCalculation.NONE:
			return "None";
		case GeneralCalculation.PERCENT_EMPTY:
			return "Empty";
		case GeneralCalculation.PERCENT_NOT_EMPTY:
			return "Not empty";
		default:
			return "";
	}
};

export const getShortDisplayNameForCalculationType = (
	value: CalculationType
) => {
	if (isNumberCalcuation(value))
		return getDisplayNameForNumberCalculation(value);
	return getShortDisplayNameForCalculation(value);
};

export const getAriaLabelForCalculation = (value: CalculationType) => {
	switch (value) {
		case GeneralCalculation.COUNT_ALL:
			return "Counts the total number of rows";
		case GeneralCalculation.COUNT_EMPTY:
			return "Counts the number of rows with an empty cell value";
		case GeneralCalculation.COUNT_NOT_EMPTY:
			return "Counts the number of rows with a non-empty cell value";
		case GeneralCalculation.COUNT_UNIQUE:
			return "Counts the number of unique values in the column";
		case GeneralCalculation.COUNT_VALUES:
			return "Counts the number of values in the column";
		case GeneralCalculation.PERCENT_EMPTY:
			return "Displays the percentage of rows with an empty cell value";
		case GeneralCalculation.PERCENT_NOT_EMPTY:
			return "Displays the percentage of rows with a non-empty cell value";
		default:
			return "";
	}
};

export const getAriaLabelForNumberCalculation = (value: NumberCalculation) => {
	switch (value) {
		case NumberCalculation.SUM:
			return "Computes the sum of the cells in the column";
		case NumberCalculation.AVG:
			return "Computes the average of the cells in the column";
		case NumberCalculation.MIN:
			return "Computes the minimum of the cells in the column";
		case NumberCalculation.MAX:
			return "Computes the maximum of the cells in the column";
		case NumberCalculation.MEDIAN:
			return "Computes the median of the cells in the column";
		case NumberCalculation.RANGE:
			return "Computes the range (max - min) of the cells in the column";
		default:
			return "";
	}
};

export const getDisplayNameForCalculation = (value: GeneralCalculation) => {
	switch (value) {
		case GeneralCalculation.COUNT_ALL:
			return "Count all";
		case GeneralCalculation.COUNT_NOT_EMPTY:
			return "Count not empty";
		case GeneralCalculation.COUNT_VALUES:
			return "Count values";
		case GeneralCalculation.COUNT_EMPTY:
			return "Count empty";
		case GeneralCalculation.COUNT_UNIQUE:
			return "Count unique";
		case GeneralCalculation.NONE:
			return "None";
		case GeneralCalculation.PERCENT_EMPTY:
			return "Percent empty";
		case GeneralCalculation.PERCENT_NOT_EMPTY:
			return "Percent not empty";
		default:
			return "";
	}
};

export const getDisplayNameForNumberCalculation = (
	value: NumberCalculation
) => {
	switch (value) {
		case NumberCalculation.SUM:
			return "Sum";
		case NumberCalculation.AVG:
			return "Average";
		case NumberCalculation.MIN:
			return "Min";
		case NumberCalculation.MAX:
			return "Max";
		case NumberCalculation.MEDIAN:
			return "Median";
		case NumberCalculation.RANGE:
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
		case CurrencyType.SWEDEN:
			return "Swedish Krona";
		case CurrencyType.DENMARK:
			return "Danish Krone";
		case CurrencyType.NORWAY:
			return "Norwegian Krone";
		case CurrencyType.ICELAND:
			return "Icelandic Króna";
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
		case CurrencyType.ISRAEL:
			return "Israeli Shekel";
		case CurrencyType.SWITZERLAND:
			return "Swiss Franc";
		default:
			return "";
	}
};

export const getDisplayNameForCellType = (type: CellType): string => {
	switch (type) {
		case CellType.TEXT:
			return "Text";
		case CellType.EMBED:
			return "Embed";
		case CellType.FILE:
			return "File";
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
