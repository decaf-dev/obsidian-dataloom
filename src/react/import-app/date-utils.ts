import dayjs from "dayjs";
import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";

export const dateStringToDateTime = (
	value: string,
	dateFormat: DateFormat,
	separator: DateFormatSeparator
): string | null => {
	const dayjsFormat = getDateFormatForDayJS(dateFormat, separator);
	const dayjsDate = dayjs(value, dayjsFormat, true);

	if (dayjsDate.isValid()) {
		return dayjsDate.toDate().toISOString();
	}
	return null;
};

const getDateFormatForDayJS = (
	format: DateFormat,
	separator: DateFormatSeparator
) => {
	switch (format) {
		case DateFormat.MM_DD_YYYY:
			return `MM${separator}DD${separator}YYYY`;
		case DateFormat.DD_MM_YYYY:
			return `DD${separator}MM${separator}YYYY`;
		case DateFormat.YYYY_MM_DD:
			return `YYYY${separator}MM${separator}DD`;
		default:
			throw new Error("Date format not supported.");
	}
};
