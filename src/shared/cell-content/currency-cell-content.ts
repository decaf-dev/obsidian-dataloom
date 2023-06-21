import { stringToCurrencyString } from "../conversion";
import { CurrencyType } from "../types";
import { isNumber } from "../match";

export const getCurrencyCellContent = (
	value: string,
	currencyType: CurrencyType
) => {
	if (isNumber(value)) return stringToCurrencyString(value, currencyType);
	return "";
};
