export const getDateParts = (date: Date) => {
	const year = date.getFullYear().toString();
	const month = ("0" + (date.getMonth() + 1)).slice(-2);
	const day = ("0" + date.getDate()).slice(-2);
	const time = date.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
    hourCycle: 'h23'
	});
	return { year, month, day, time };
};

export const getUTCTimeFromDateParts = (
	year: string,
	month: string,
	day: string,
  hour: string,
  minute: string
) => {
	return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`).getTime();
};

export const removeLastComma = (value: string) => {
	const commaIndex = value.lastIndexOf(",");
	return value.substring(0, commaIndex) + value.substring(commaIndex + 1);
};
