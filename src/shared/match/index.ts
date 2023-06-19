import { Calculation, NumberCalculation } from "src/shared/types";
import {
	NUMBER_REGEX,
	DATE_REGEX,
	CHECKBOX_REGEX,
	CHECKBOX_CHECKED_REGEX,
	NUMBER_INPUT_REGEX,
	URL_REGEX,
	IMAGE_REGEX,
} from "./regex";

export const isNumber = (value: string): boolean => {
	return value.match(NUMBER_REGEX) !== null;
};

export const isNumberInput = (value: string): boolean => {
	return value.match(NUMBER_INPUT_REGEX) !== null;
};

export const isDate = (value: string): boolean => {
	return value.match(DATE_REGEX) !== null;
};

export const isCheckbox = (value: string): boolean => {
	return value.match(CHECKBOX_REGEX) !== null;
};

export const isCheckboxChecked = (value: string): boolean => {
	return value.match(CHECKBOX_CHECKED_REGEX) !== null;
};

export const isURL = (value: string): boolean => {
	return value.match(URL_REGEX) !== null;
};

export const isImage = (value: string): boolean => {
	return value.match(IMAGE_REGEX) !== null;
};

export const isNumberCalcuation = (
	value: Calculation | NumberCalculation
): value is NumberCalculation => {
	return Object.values(NumberCalculation).includes(
		value as NumberCalculation
	);
};
