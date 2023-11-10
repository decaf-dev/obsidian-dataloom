import { dateTimeToDateString } from "../date/date-time-conversion";
import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";

export const getTimeCellContent = (
	dateTime: string | null,
	format: DateFormat,
	separator: DateFormatSeparator,
	hour12: boolean
) => {
	if (dateTime !== null) {
		return dateTimeToDateString(dateTime, format, separator, {
			includeTime: true,
			hour12,
		});
	}
	return "";
};
