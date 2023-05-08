import { CurrencyType } from "./table-state/types";

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

export const stringToCurrencyString = (value: string, type: CurrencyType) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: type,
	}).format(parseFloat(value));
};
