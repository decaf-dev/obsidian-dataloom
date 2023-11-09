import dayjs from "dayjs";
import { getDateFormatString, padToTwoDigits } from "./utils";
import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";
import { isValidDateString } from "./date-validation";

export const dateStringToDateTime = (
	dateString: string,
	format: DateFormat,
	separator: DateFormatSeparator
) => {
	if (!isValidDateString(dateString, format, separator)) return null;

	const dayjsFormat = getDateFormatString(format, separator);
	const dayjsDate = dayjs(dateString, dayjsFormat, true);
	return dayjsDate.toISOString();
};

export const dateTimeToTimeString = (
	dateTime: string,
	options?: {
		locale?: string;
		hour12?: boolean;
	}
) => {
	const { locale = navigator.language, hour12 = true } = options || {};
	const date = new Date(dateTime);

	const time = date.toLocaleString(locale, {
		hour: "numeric",
		minute: "numeric",
		hour12,
	});
	return time;
};

//TODO add relative
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

	// const MILLIS_SECOND = 1000;
	// const MILLIS_MINUTE = MILLIS_SECOND * 60;
	// const MILLIS_HOUR = MILLIS_MINUTE * 60;
	// const MILLIS_DAY = MILLIS_HOUR * 24;

	const date = new Date(dateTime);
	const year = date.getFullYear();
	const month = padToTwoDigits(date.getMonth() + 1);
	const day = padToTwoDigits(date.getDate());

	let formattedDate;

	switch (format) {
		case DateFormat.MM_DD_YYYY:
			formattedDate = month + separator + day + separator + year;
			break;
		case DateFormat.DD_MM_YYYY:
			formattedDate = day + separator + month + separator + year;
			break;
		case DateFormat.YYYY_MM_DD:
			formattedDate = year + separator + month + separator + day;
			break;
		// case DateFormat.RELATIVE: {
		// 	const diff = Date.now() - date.getTime();

		// 	if (diff < MILLIS_DAY) {
		// 		return "Today";
		// 	} else if (diff < MILLIS_DAY * 2) {
		// 		return "Yesterday";
		// 	} else if (diff < MILLIS_DAY * 7) {
		// 		return date.toLocaleString(locale, { weekday: "long" });
		// 	} else {
		// 		return date.toLocaleString(locale, {
		// 			month: "short",
		// 			day: "numeric",
		// 			year: "numeric",
		// 		});
		// 	}
		// }
		default:
			throw new Error("Date format not supported.");
	}
	if (includeTime) {
		const time = date.toLocaleString(locale, {
			hour: "numeric",
			minute: "numeric",
			hour12,
		});
		formattedDate += " " + time;
	}

	return formattedDate;
};
