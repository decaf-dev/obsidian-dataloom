import { unixTimeToDateString } from "../date/date-conversion";
import { DateFormat } from "../loom-state/types/loom-state";

export const getDateCellContent = (
	dateTime: number | null,
	format: DateFormat
) => {
	if (dateTime !== null) return unixTimeToDateString(dateTime, format);
	return "";
};
