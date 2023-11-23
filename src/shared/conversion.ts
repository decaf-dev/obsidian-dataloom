export const pxToNum = (value: string) => {
	return parseFloat(value.split("px")[0]);
};

export const numToPx = (value: number | string) => {
	return `${value}px`;
};
