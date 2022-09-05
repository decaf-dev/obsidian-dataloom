import {
	NUMBER_REGEX,
	TAG_REGEX,
	DATE_REGEX,
	CHECKBOX_REGEX,
	CHECKBOX_CHECKED_REGEX,
	TAGS_REGEX,
} from "src/services/string/regex";

const isMatch = (input: string, regex: RegExp): boolean => {
	return (input.match(regex) || []).length !== 0;
};

const countNumMatch = (input: string, regex: RegExp): number => {
	return (input.match(regex) || []).length;
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

/**
 * Counts the number of tags in a string.
 * @param input The input string
 * @returns The number of tags in the input string
 */
export const countNumTags = (input: string): number => {
	return countNumMatch(input, TAGS_REGEX);
};
