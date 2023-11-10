import dayjs from "dayjs";
import { getDateFormatString, getTimeFormatString } from "./utils";
import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const dateStringToDateTime = (
	dateString: string,
	format: DateFormat,
	separator: DateFormatSeparator,
	options?: {
		timeString: string;
		hour12: boolean;
	}
) => {
	const { timeString, hour12 = false } = options ?? {};

	let convertString = dateString;
	let dayJSFormat = getDateFormatString(format, separator);
	if (timeString) {
		dayJSFormat += " " + getTimeFormatString(hour12);
		convertString += " " + timeString;
	}
	const dayjsDate = dayjs(convertString, dayJSFormat, true);
	return dayjsDate.toISOString();
};
