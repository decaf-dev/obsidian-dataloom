import {
	getAverage,
	getMaximum,
	getMedian,
	getMinimum,
	getRange,
	getSum,
} from "src/services/arithmetic/utils";
import { stringToCurrencyString } from "src/services/string/conversion";
import {
	CellType,
	CurrencyType,
	NumberFunction,
} from "src/services/tableState/types";
import { normalizeDecimal } from "./utils";

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
		return normalizeDecimal(getAverage(values));
	} else if (type === NumberFunction.MAX) {
		return getMaximum(values);
	} else if (type === NumberFunction.MIN) {
		return getMinimum(values);
	} else if (type === NumberFunction.RANGE) {
		return normalizeDecimal(getRange(values));
	} else if (type === NumberFunction.SUM) {
		return normalizeDecimal(getSum(values));
	} else if (type === NumberFunction.MEDIAN) {
		return normalizeDecimal(getMedian(values));
	} else {
		throw new Error("Unhandled number function");
	}
};
