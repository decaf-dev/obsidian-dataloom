import {
	DateFormat,
	DateFormatSeparator,
} from "../loom-state/types/loom-state";
import { padToTwoDigits } from "./utils";

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

	const date = new Date(dateTime);
	const year = date.getFullYear();
	const month = padToTwoDigits(date.getMonth() + 1);
	const day = padToTwoDigits(date.getDate());

	let formattedDate = "";

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

		default:
			throw new Error("Date format not supported.");
	}
	const formattedTime = date.toLocaleString(locale, {
		hour: "numeric",
		minute: "numeric",
		hour12,
	});

	if (includeTime) {
		return formattedDate + " " + formattedTime;
	}
	return formattedDate;
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
