import { stringToCurrencyString } from "../conversion";
import { NumberFormat, CurrencyType } from "../loom-state/types/loom-state";
import { isNumber } from "../match";

export const getNumberCellContent = (
	format: NumberFormat,
	currency: CurrencyType,
	value: string
) => {
	if (isNumber(value)) {
		if (format === NumberFormat.CURRENCY) {
			return stringToCurrencyString(value, currency);
		}
		return value;
	}
	return "";
};
