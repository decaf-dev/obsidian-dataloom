export const dateToString = (date: Date): string => {
	const year = date.getFullYear();
	const month = ("0" + (date.getMonth() + 1)).slice(-2);
	const day = ("0" + date.getDate()).slice(-2);
	return `${year}/${month}/${day}`;
};

export const pxToNum = (pixels: string) => {
	return parseFloat(pixels.split("px")[0]);
};

export const numToPx = (num: number) => {
	return `${num}px`;
};

export const dateTimeToString = (dateTime: number) => {
	const date = new Date(dateTime);
	const dateString = date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
	const commaIndex = dateString.lastIndexOf(",");
	return (
		dateString.substring(0, commaIndex) +
		dateString.substring(commaIndex + 1)
	);
};
