import dayjs from "dayjs";
import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import { getDateFormatString } from "./utils";

export const isValidDateString = (
	value: string,
	format: DateFormat,
	separator: DateFormatSeparator
) => {
	const dateFormatString = getDateFormatString(format, separator);
	const dayjsDate = dayjs(value, dateFormatString, true);
	return dayjsDate.isValid();
};
