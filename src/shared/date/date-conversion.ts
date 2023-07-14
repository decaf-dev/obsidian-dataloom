import { DateFormat } from "../types";
import { MILLIS_IN_DAY } from "./constants";
import { DD_MM_YYYY_REGEX, MM_DD_YYYY_REGEX, YYYY_MM_DD_REGEX } from "./regex";
import {
	getDateParts,
	getUTCTimeFromDateParts,
	removeLastComma,
} from "./utils";

const getRegExForFomat = (dateFormat: DateFormat) => {
  switch (dateFormat) {
    case DateFormat.MM_DD_YYYY:
      return MM_DD_YYYY_REGEX
    case DateFormat.DD_MM_YYYY:
      return DD_MM_YYYY_REGEX
    case DateFormat.YYYY_MM_DD:
      return YYYY_MM_DD_REGEX
    default:
      throw new Error("Date format not supported.");
  }
}

const getDatePartsFromMatch = (value: string, dateFormat: DateFormat) => {
  const re = getRegExForFomat(dateFormat);
  const match = value.match(re);
  console.log(match);
  if (match == null) {
    throw new Error("Date format not supported.");
  }

  switch (dateFormat) {
    case DateFormat.MM_DD_YYYY:
      var year = match[3];
      var month = match[1];
      var day = match[2];
      break;
    case DateFormat.DD_MM_YYYY:
      var year = match[3];
      var month = match[2];
      var day = match[1];
      break;
    case DateFormat.YYYY_MM_DD:
      var year = match[1];
      var month = match[2];
      var day = match[3];
      break;
    default:
      throw new Error("Unreachable");
  }
  
  var am_pm = match[6];
  if (am_pm == undefined) {
    var hour: number | string = match[7] || "00";
    var minute = match[8] || "00";
  } else {
    var hour: number | string = parseInt(match[4] || "00");
    var minute = match[5] || "00";
    if (am_pm == "PM") { hour = hour + 12;}
    hour = hour.toString();
  }

  if (hour.length == 1) hour = '0' + hour;

  return {year, month, day, hour, minute}
}

export const dateStringToUnixTime = (value: string, dateFormat: DateFormat) => {
	const {year, month, day, hour, minute} = getDatePartsFromMatch(value, dateFormat);
  return getUTCTimeFromDateParts(year, month, day, hour, minute);
};

export const unixTimeToDateString = (unixTime: number, format: DateFormat) => {
	const date = new Date(unixTime);
	var { year, month, day, time } = getDateParts(date);
  if (time.endsWith(":63")) { time = "" }
	
  switch (format) {
		case DateFormat.MM_DD_YYYY:
			return `${month}/${day}/${year} ${time}`;
		case DateFormat.DD_MM_YYYY:
			return `${day}.${month}.${year} ${time}`;
		case DateFormat.YYYY_MM_DD:
			return `${year}-${month}-${day} ${time}`;
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
