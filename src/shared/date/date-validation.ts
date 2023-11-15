import dayjs from "dayjs";

import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import { getDateFormatString } from "./utils";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const isValidDateString = (
	value: string,
	format: DateFormat,
	separator: DateFormatSeparator
) => {
	const dateFormatString = getDateFormatString(format, separator);
	const dayjsDate = dayjs(value, dateFormatString, true);
	return dayjsDate.isValid();
};

export const isValidTimeString = (value: string, hour12: boolean) => {
	const dayjsDate = dayjs(value, hour12 ? "h:mm A" : "HH:mm", true);
	return dayjsDate.isValid();
};
