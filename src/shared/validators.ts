import { GeneralFunction, NumberFunction } from "src/shared/table-state/types";
import {
	NUMBER_REGEX,
	TAG_REGEX,
	DATE_REGEX,
	CHECKBOX_REGEX,
	CHECKBOX_CHECKED_REGEX,
} from "./regex";

export const isNumber = (input: string): boolean => {
	return input.match(NUMBER_REGEX) !== null;
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

export const isTag = (input: string): boolean => {
	return input.match(TAG_REGEX) !== null;
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
