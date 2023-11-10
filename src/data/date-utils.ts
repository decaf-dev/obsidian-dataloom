import { padToTwoDigits } from "src/shared/date/utils";

export const dateTimeToObsidianDateTime = (
	value: string,
	includeTime: boolean
) => {
	const date = new Date(value);

	//Get local components
	const year = date.getFullYear();
	const month = padToTwoDigits(date.getMonth() + 1); // getMonth() returns 0-11
	const day = padToTwoDigits(date.getDate());
	const hours = padToTwoDigits(date.getHours());
	const minutes = padToTwoDigits(date.getMinutes());
	const seconds = padToTwoDigits(date.getSeconds());

	const dateString = `${year}-${month}-${day}`;

	if (!includeTime) {
		return dateString;
	}
	return `${dateString}T${hours}:${minutes}:${seconds}`;
};
