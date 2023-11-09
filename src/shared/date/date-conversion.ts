import dayjs from "dayjs";
import { getDateFormatString } from "./utils";
import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";

export const dateStringToDateTime = (
	dateString: string,
	format: DateFormat,
	separator: DateFormatSeparator
) => {
	const dayjsFormat = getDateFormatString(format, separator);
	const dayjsDate = dayjs(dateString, dayjsFormat, true);
	return dayjsDate.toISOString();
};

export const dateTimeToDateString = (
	dateTime: string,
	format: DateFormat,
	separator: DateFormatSeparator,
	options?: {
		locale?: string;
		includeTime?: boolean;
		hour12?: boolean;
	}
) => {
	const {
		locale = navigator.language,
		includeTime = false,
		hour12 = true,
	} = options || {};

	const MILLIS_SECOND = 1000;
	const MILLIS_MINUTE = MILLIS_SECOND * 60;
	const MILLIS_HOUR = MILLIS_MINUTE * 60;
	const MILLIS_DAY = MILLIS_HOUR * 24;

	const date = new Date(dateTime);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const time = date.toLocaleString(locale, {
		hour: "numeric",
		minute: "numeric",
		hour12,
	});

	switch (format) {
		case DateFormat.MM_DD_YYYY: {
			let format = month + separator + day + separator + year;
			if (includeTime) {
				format += " " + time;
			}
			return format;
		}
		case DateFormat.DD_MM_YYYY: {
			let format = day + separator + month + separator + year;
			if (includeTime) {
				format += " " + time;
			}
			return format;
		}
		case DateFormat.YYYY_MM_DD: {
			let format = year + separator + month + separator + day;
			if (includeTime) {
				format += " " + time;
			}
			return format;
		}
		case DateFormat.RELATIVE: {
			const diff = Date.now() - date.getTime();

			if (diff < MILLIS_DAY) {
				return "Today";
			} else if (diff < MILLIS_DAY * 2) {
				return "Yesterday";
			} else if (diff < MILLIS_DAY * 7) {
				return date.toLocaleString(locale, { weekday: "long" });
			} else {
				return date.toLocaleString(locale, {
					month: "short",
					day: "numeric",
					year: "numeric",
				});
			}
		}
		default:
			throw new Error("Date format not supported.");
	}
};
