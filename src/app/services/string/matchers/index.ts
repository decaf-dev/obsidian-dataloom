import { EXTERNAL_LINK_REGEX, FILE_LINK_REGEX } from "../regex";
import { isNumber, isTag, isDate } from "../validators";
import { CELL_TYPE } from "src/app/constants";

export const matchURLs = (input: string) => {
	return input.match(EXTERNAL_LINK_REGEX) || [];
};

export const matchFileLinks = (input: string) => {
	return input.match(FILE_LINK_REGEX) || [];
};

/**
 * Counts the number of tags in a string.
 * @param input The input string
 * @returns The number of tags in the input string
 */
export const countNumTags = (input: string): number => {
	return (input.match(/#[^ \t]+/g) || []).length;
};

export const findCellType = (textContent: string, expectedType: string) => {
	//If empty then just set it to the type it's supposed to be.
	//We do this to allow blank cells
	if (textContent === "") return expectedType;

	//Allow everything
	if (expectedType === CELL_TYPE.TEXT) {
		return CELL_TYPE.TEXT;
	} else if (expectedType === CELL_TYPE.NUMBER) {
		if (isNumber(textContent)) return CELL_TYPE.NUMBER;
	} else if (expectedType === CELL_TYPE.TAG) {
		if (isTag(textContent)) return CELL_TYPE.TAG;
	} else if (expectedType === CELL_TYPE.DATE) {
		if (isDate(textContent)) return CELL_TYPE.DATE;
	}
	return CELL_TYPE.ERROR;
};
