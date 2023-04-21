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
		return getAverage(values);
	} else if (type === NumberFunction.MAX) {
		return getMaximum(values);
	} else if (type === NumberFunction.MIN) {
		return getMinimum(values);
	} else if (type === NumberFunction.RANGE) {
		return getRange(values);
	} else if (type === NumberFunction.SUM) {
		return getSum(values);
	} else if (type === NumberFunction.MEDIAN) {
		return getMedian(values);
	} else {
		throw new Error("Unhandled number function");
	}
};
