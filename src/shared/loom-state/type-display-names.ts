import { isNumberCalcuation } from "../match";
import {
	GeneralCalculation,
	CalculationType,
	CellType,
	CurrencyType,
	DateFormat,
	NumberCalculation,
	FilterCondition,
	TextFilterCondition,
	NumberFilterCondition,
	DateFilterCondition,
	DateFilterOption,
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
		case CurrencyType.SOUTH_KOREA:
			return "Won";
		case CurrencyType.CHINA:
			return "Yuan";
		case CurrencyType.JAPAN:
			return "Yen";
		case CurrencyType.UAE:
			return "Dirham";
		case CurrencyType.SAUDI_ARABIA:
			return "Riyal";
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
		case CurrencyType.GREAT_BRITAIN:
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
		default:
			return "";
	}
};

export const getDisplayNameForFilterCondition = (type: FilterCondition) => {
	switch (type) {
		case TextFilterCondition.IS:
		case DateFilterCondition.IS:
			return "Is";
		case TextFilterCondition.IS_NOT:
			return "Is not";
		case TextFilterCondition.CONTAINS:
			return "Contains";
		case TextFilterCondition.DOES_NOT_CONTAIN:
			return "Does not contain";
		case TextFilterCondition.STARTS_WITH:
			return "Starts with";
		case TextFilterCondition.ENDS_WITH:
			return "Ends with";
		case NumberFilterCondition.IS_EQUAL:
			return "=";
		case NumberFilterCondition.IS_NOT_EQUAL:
			return "!=";
		case NumberFilterCondition.IS_GREATER:
			return ">";
		case NumberFilterCondition.IS_GREATER_OR_EQUAL:
			return ">=";
		case NumberFilterCondition.IS_LESS:
			return "<";
		case NumberFilterCondition.IS_LESS_OR_EQUAL:
			return "<=";
		case DateFilterCondition.IS_AFTER:
			return "Is after";
		case DateFilterCondition.IS_BEFORE:
			return "Is before";
		case TextFilterCondition.IS_EMPTY:
		case NumberFilterCondition.IS_EMPTY:
		case DateFilterCondition.IS_EMPTY:
			return "Is empty";
		case TextFilterCondition.IS_NOT_EMPTY:
		case NumberFilterCondition.IS_NOT_EMPTY:
		case DateFilterCondition.IS_NOT_EMPTY:
			return "Is not empty";
		default:
			return "";
	}
};

export const getDisplayNameForDateFilterOption = (value: DateFilterOption) => {
	switch (value) {
		case DateFilterOption.UNSELECTED:
			return "Select an option";
		case DateFilterOption.TODAY:
			return "Today";
		case DateFilterOption.TOMORROW:
			return "Tomorrow";
		case DateFilterOption.YESTERDAY:
			return "Yesterday";
		case DateFilterOption.ONE_WEEK_AGO:
			return "One week ago";
		case DateFilterOption.ONE_WEEK_FROM_NOW:
			return "One week from now";
		case DateFilterOption.ONE_MONTH_AGO:
			return "One month ago";
		case DateFilterOption.ONE_MONTH_FROM_NOW:
			return "One month from now";
		default:
			return "";
	}
};
