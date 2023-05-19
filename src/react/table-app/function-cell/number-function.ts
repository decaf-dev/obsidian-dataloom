import {
	getAverage,
	getMaximum,
	getMedian,
	getMinimum,
	getRange,
	getSum,
} from "./arithmetic";
import { stringToCurrencyString } from "src/shared/conversion";
import {
	CellType,
	CurrencyType,
	NumberFunction,
} from "src/shared/table-state/types";
import { round2Digits } from "./utils";

export const getNumberFunctionContent = (
	values: number[],
	cellType: CellType,
	currencyType: CurrencyType,
	functionType: NumberFunction
) => {
	const value = getNumberFunctionValue(values, functionType).toString();
	if (cellType === CellType.CURRENCY)
		return stringToCurrencyString(value, currencyType);
	return value;
};

const getNumberFunctionValue = (values: number[], type: NumberFunction) => {
	if (type === NumberFunction.AVG) {
		return round2Digits(getAverage(values));
	} else if (type === NumberFunction.MAX) {
		return getMaximum(values);
	} else if (type === NumberFunction.MIN) {
		return getMinimum(values);
	} else if (type === NumberFunction.RANGE) {
		return round2Digits(getRange(values));
	} else if (type === NumberFunction.SUM) {
		return round2Digits(getSum(values));
	} else if (type === NumberFunction.MEDIAN) {
		return round2Digits(getMedian(values));
	} else {
		throw new Error("Unhandled number function");
	}
};
