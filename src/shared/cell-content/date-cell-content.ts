import { unixTimeToDateString } from "../date/date-conversion";
import { DateFormat } from "../types";

export const getDateCellContent = (
	dateTime: number | null,
	format: DateFormat
) => {
	if (dateTime !== null) return unixTimeToDateString(dateTime, format);
	return "";
};
