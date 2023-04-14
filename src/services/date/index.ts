import { DateFormat } from "../tableState/types";
import { MILLIS_IN_DAY } from "./constants";

export const unixTimeToString = (unixTime: number, format: DateFormat) => {
	const date = new Date(unixTime);

	const dateString = getDateStringForFormat(date, format);
	const commaIndex = dateString.lastIndexOf(",");
	return (
		dateString.substring(0, commaIndex) +
		dateString.substring(commaIndex + 1)
	);
};

const getDateParts = (date: Date) => {
	const year = date.getFullYear();
	const month = ("0" + (date.getMonth() + 1)).slice(-2);
	const day = ("0" + date.getDate()).slice(-2);
	const time = date.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
	return { year, month, day, time };
};

const getDateStringForFormat = (date: Date, format: DateFormat) => {
	const { year, month, day, time } = getDateParts(date);

	switch (format) {
		case DateFormat.MM_DD_YYYY:
			return `${month}/${day}/${year} ${time}`;
		case DateFormat.DD_MM_YYYY:
			return `${day}/${month}/${year} ${time}`;
		case DateFormat.YYYY_MM_DD:
			return `${year}/${month}/${day} ${time}`;
		case DateFormat.FULL:
			return date.toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			});
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
			}

			return date.toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			});
		}
		default:
			return "";
	}
};
