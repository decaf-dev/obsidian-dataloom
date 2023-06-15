import { Calculation, NumberCalculation } from "src/shared/types";
import {
	NUMBER_REGEX,
	DATE_REGEX,
	CHECKBOX_REGEX,
	CHECKBOX_CHECKED_REGEX,
	NUMBER_INPUT_REGEX,
	URL_REGEX,
} from "./regex";

export const isNumber = (input: string): boolean => {
	return input.match(NUMBER_REGEX) !== null;
};

export const isValidNumberInput = (input: string): boolean => {
	return input.match(NUMBER_INPUT_REGEX) !== null;
};

export const isDate = (input: string): boolean => {
	return input.match(DATE_REGEX) !== null;
};

export const isCheckbox = (input: string): boolean => {
	return input.match(CHECKBOX_REGEX) !== null;
};

export const isCheckboxChecked = (input: string): boolean => {
	return input.match(CHECKBOX_CHECKED_REGEX) !== null;
};

export const isURL = (input: string): boolean => {
	return input.match(URL_REGEX) !== null;
};

export const isNumberCalcuation = (
	value: Calculation | NumberCalculation
): value is NumberCalculation => {
	return Object.values(NumberCalculation).includes(
		value as NumberCalculation
	);
};
