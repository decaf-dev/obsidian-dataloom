import {
	NUMBER_REGEX,
	TAG_REGEX,
	DATE_REGEX,
	CHECKBOX_REGEX,
	CHECKBOX_CHECKED_REGEX,
} from "./regex";

const isMatch = (input: string, regex: RegExp): boolean => {
	return (input.match(regex) || []).length !== 0;
};

export const isNumber = (input: string): boolean => {
	return isMatch(input, NUMBER_REGEX);
};

export const isDate = (input: string): boolean => {
	return isMatch(input, DATE_REGEX);
};

export const isCheckbox = (input: string): boolean => {
	return isMatch(input, CHECKBOX_REGEX);
};

export const isTag = (input: string): boolean => {
	return isMatch(input, TAG_REGEX);
};

export const isCheckboxChecked = (input: string): boolean => {
	return isMatch(input, CHECKBOX_CHECKED_REGEX);
};
