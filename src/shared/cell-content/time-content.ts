import { unixTimeToDateTimeString } from "../date/date-conversion";
import { DateFormat } from "../types";

export const getTimeCellContent = (
	dateTime: number | null,
	format: DateFormat
) => {
	if (dateTime !== null) return unixTimeToDateTimeString(dateTime, format);
	return "";
};
