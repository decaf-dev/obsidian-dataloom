export const addThousandsSeparator = (num: string, separator: string) => {
	const regex = /\B(?=(\d{3})+(?!\d))/g;
	return num.replace(regex, separator);
};
