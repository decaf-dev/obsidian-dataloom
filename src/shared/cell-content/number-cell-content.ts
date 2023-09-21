import { addThousandsSeparator } from "src/react/loom-app/number-cell/utils";
import { stringToCurrencyString } from "../conversion";
import { NumberFormat, CurrencyType } from "../loom-state/types/loom-state";
import { isNumber } from "../match";

export const getNumberCellContent = (
	format: NumberFormat,
	value: string,
	options?: {
		currency?: CurrencyType;
		prefix?: string;
		suffix?: string;
		separator?: string;
	}
) => {
	const { currency, separator, suffix, prefix } = options ?? {};

	if (!isNumber(value)) {
		return "";
	}

	if (format === NumberFormat.CURRENCY) {
		if (currency === undefined) {
			throw new Error("currency is required when format is currency");
		}
		return stringToCurrencyString(value, currency);
	}
	if (separator && value.length > 0)
		value = addThousandsSeparator(value, separator);
	if (prefix && value.length > 0) value = `${prefix} ${value}`;
	if (suffix && value.length > 0) value = `${value} ${suffix}`;
	return value;
};
