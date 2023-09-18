import { DateFormat } from "../loom-state/types/loom-state";
import { MILLIS_IN_DAY } from "./constants";
import { DD_MM_YYYY_REGEX, MM_DD_YYYY_REGEX, YYYY_MM_DD_REGEX } from "./regex";
import {
	getDateParts,
	getUTCTimeFromDateParts,
	removeLastComma,
} from "./utils";

export const dateStringToUnixTime = (value: string, dateFormat: DateFormat) => {
	const parts = value.split("/");
	switch (dateFormat) {
		case DateFormat.MM_DD_YYYY:
			return getUTCTimeFromDateParts(parts[2], parts[0], parts[1]);
		case DateFormat.DD_MM_YYYY:
			return getUTCTimeFromDateParts(parts[2], parts[1], parts[0]);
		case DateFormat.YYYY_MM_DD:
			return getUTCTimeFromDateParts(parts[0], parts[1], parts[2]);
		default:
			throw new Error("Date format not supported.");
	}
};

export const unixTimeToDateString = (unixTime: number, format: DateFormat) => {
	const date = new Date(unixTime);
	const { year, month, day } = getDateParts(date);

	switch (format) {
		case DateFormat.MM_DD_YYYY:
			return `${month}/${day}/${year}`;
		case DateFormat.DD_MM_YYYY:
			return `${day}/${month}/${year}`;
		case DateFormat.YYYY_MM_DD:
			return `${year}/${month}/${day}`;
		case DateFormat.FULL:
			return date.toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		case DateFormat.RELATIVE: {
			const diff = Date.now() - date.getTime();

			if (diff < MILLIS_IN_DAY) {
				return "Today";
			} else if (diff < MILLIS_IN_DAY * 2) {
				return "Yesterday";
			} else if (diff < MILLIS_IN_DAY * 7) {
				return date.toLocaleString("en-US", { weekday: "long" });
			} else {
				return date.toLocaleString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});
			}
		}
		default:
			return "";
	}
};

//TODO refactor with optional time format
export const unixTimeToDateTimeString = (
	unixTime: number,
	format: DateFormat
) => {
	const date = new Date(unixTime);
	const { year, month, day, time } = getDateParts(date);

	switch (format) {
		case DateFormat.MM_DD_YYYY:
			return `${month}/${day}/${year} ${time}`;
		case DateFormat.DD_MM_YYYY:
			return `${day}/${month}/${year} ${time}`;
		case DateFormat.YYYY_MM_DD:
			return `${year}/${month}/${day} ${time}`;
		case DateFormat.FULL: {
			const value = date.toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			});
			return removeLastComma(value);
		}
		case DateFormat.RELATIVE: {
			const diff = Date.now() - date.getTime();
			const time = date.toLocaleString("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			});

			if (diff < MILLIS_IN_DAY) {
				return "Today" + " " + time;
			} else if (diff < MILLIS_IN_DAY * 2) {
				return "Yesterday" + " " + time;
			} else if (diff < MILLIS_IN_DAY * 7) {
				return (
					date.toLocaleString("en-US", { weekday: "long" }) +
					" " +
					time
				);
			} else {
				const value = date.toLocaleString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
					hour: "numeric",
					minute: "numeric",
					hour12: true,
				});
				return removeLastComma(value);
			}
		}
		default:
			return "";
	}
};

export const isValidDateFormat = (value: string, dateFormat: DateFormat) => {
	switch (dateFormat) {
		case DateFormat.MM_DD_YYYY:
			return value.match(MM_DD_YYYY_REGEX) !== null;
		case DateFormat.DD_MM_YYYY:
			return value.match(DD_MM_YYYY_REGEX) !== null;
		case DateFormat.YYYY_MM_DD:
			return value.match(YYYY_MM_DD_REGEX) !== null;
		default:
			return false;
	}
};
