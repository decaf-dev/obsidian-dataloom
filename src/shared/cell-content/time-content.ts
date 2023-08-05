import { unixTimeToDateTimeString } from "../date/date-conversion";
import { DateFormat } from "../loom-state/types";

export const getTimeCellContent = (
	dateTime: number | null,
	format: DateFormat
) => {
	if (dateTime !== null) return unixTimeToDateTimeString(dateTime, format);
	return "";
};
