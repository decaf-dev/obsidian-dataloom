import { GeneralFunction, NumberFunction } from "src/shared/types/types";
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

export const isGeneralFunction = (
	value: GeneralFunction | NumberFunction
): value is GeneralFunction => {
	return Object.values(GeneralFunction).includes(value as GeneralFunction);
};

export const isNumberFunction = (
	value: GeneralFunction | NumberFunction
): value is NumberFunction => {
	return Object.values(NumberFunction).includes(value as NumberFunction);
};
