import { dateTimeToDateString } from "../date/date-time-conversion";
import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";

export const getDateCellContent = (
	dateTime: string | null,
	format: DateFormat,
	separator: DateFormatSeparator,
	includeTime: boolean,
	hour12: boolean
) => {
	if (dateTime !== null)
		return dateTimeToDateString(dateTime, format, separator, {
			includeTime,
			hour12,
		});
	return "";
};
