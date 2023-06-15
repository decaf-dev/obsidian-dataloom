import {
	getAverage,
	getMaximum,
	getMedian,
	getMinimum,
	getRange,
	getSum,
} from "./arithmetic";
import { CellType, CurrencyType, NumberCalculation } from "src/shared/types";
import { round2Digits } from "./utils";
import { getCurrencyCellContent } from "src/shared/cell-content/currency-cell-content";

export const getNumberCalculationContent = (
	values: number[],
	cellType: CellType,
	currencyType: CurrencyType,
	calculationType: NumberCalculation
) => {
	const value = getNumberCalculation(values, calculationType).toString();
	if (cellType === CellType.CURRENCY)
		return getCurrencyCellContent(value, currencyType);
	return value;
};

const getNumberCalculation = (values: number[], type: NumberCalculation) => {
	if (type === NumberCalculation.AVG) {
		return round2Digits(getAverage(values));
	} else if (type === NumberCalculation.MAX) {
		return getMaximum(values);
	} else if (type === NumberCalculation.MIN) {
		return getMinimum(values);
	} else if (type === NumberCalculation.RANGE) {
		return round2Digits(getRange(values));
	} else if (type === NumberCalculation.SUM) {
		return round2Digits(getSum(values));
	} else if (type === NumberCalculation.MEDIAN) {
		return round2Digits(getMedian(values));
	} else {
		throw new Error("Unhandled number calculation type");
	}
};
