import { CurrencyType } from "./loom-state/types/loom-state";

export const pxToNum = (value: string) => {
	return parseFloat(value.split("px")[0]);
};

export const numToPx = (value: number | string) => {
	return `${value}px`;
};

export const stringToCurrencyString = (value: string, type: CurrencyType) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: type,
	}).format(parseFloat(value));
};
