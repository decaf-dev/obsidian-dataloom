import { isNumber } from "../validators";

export const getNumberCellContent = (value: string) => {
	if (isNumber(value)) return value;
	return "";
};
