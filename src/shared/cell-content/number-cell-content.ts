import { isNumber } from "../match";

export const getNumberCellContent = (value: string) => {
	if (isNumber(value)) return value;
	return "";
};
