import { dateTimeToDateString } from "../date/date-conversion";
import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";

export const getDateCellContent = (
	dateTime: string | null,
	format: DateFormat,
	separator: DateFormatSeparator
) => {
	if (dateTime !== null)
		return dateTimeToDateString(dateTime, format, separator);
	return "";
};
