import {
	getAverage,
	getMaximum,
	getMedian,
	getMinimum,
	getRange,
	getSum,
} from "./arithmetic";
import {
	CurrencyType,
	NumberCalculation,
	NumberFormat,
} from "src/shared/loom-state/types/loom-state";
import { round2Digits } from "./utils";
import { getNumberCellContent } from "src/shared/cell-content/number-cell-content";

export const getNumberCalculationContent = (
	values: number[],
	format: NumberFormat,
	currency: CurrencyType,
	calculation: NumberCalculation
) => {
	const value = getNumberCalculation(values, calculation).toString();
	if (format === NumberFormat.CURRENCY) {
		return getNumberCellContent(format, value, {
			currency,
		});
	}
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
