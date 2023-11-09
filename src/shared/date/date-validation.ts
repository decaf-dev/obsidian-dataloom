import dayjs from "dayjs";

import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import { getDateFormatString } from "./utils";

// Extend dayjs with the customParseFormat plugin
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

export const isValidDateString = (
	value: string,
	format: DateFormat,
	separator: DateFormatSeparator
) => {
	switch (format) {
	}
	const dateFormatString = getDateFormatString(format, separator);
	const dayjsDate = dayjs(value, dateFormatString, true);
	return dayjsDate.isValid();
};
