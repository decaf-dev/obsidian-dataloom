export const uppercaseFirst = (input: string) => {
	return input.charAt(0).toUpperCase() + input.slice(1);
};

export const dateTimeToString = (dateTime: number) => {
	const date = new Date(dateTime);
	return date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
};
