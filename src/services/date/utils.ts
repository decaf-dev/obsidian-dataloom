import { DateFormat } from "../tableState/types";
import { DD_MM_YYYY_REGEX, MM_DD_YYYY_REGEX, YYYY_MM_DD_REGEX } from "./regex";

export const isValidDateFormat = (value: string, dateFormat: DateFormat) => {
	switch (dateFormat) {
		case DateFormat.MM_DD_YYYY:
			return value.match(MM_DD_YYYY_REGEX) !== null;
		case DateFormat.DD_MM_YYYY:
			return value.match(DD_MM_YYYY_REGEX) !== null;
		case DateFormat.YYYY_MM_DD:
			return value.match(YYYY_MM_DD_REGEX) !== null;
		default:
			return false;
	}
};
