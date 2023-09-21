import {
	GeneralCalculation,
	NumberCalculation,
} from "src/shared/loom-state/types/loom-state";
import {
	NUMBER_REGEX,
	DATE_REGEX,
	CHECKBOX_REGEX,
	CHECKBOX_CHECKED_REGEX,
	NUMBER_INPUT_REGEX,
	TWITTER_LINK_REGEX,
	YOUTUBE_LINK_REGEX,
	IMAGE_EXTENSION_REGEX,
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

export const isImage = (value: string): boolean => {
	return value.match(IMAGE_EXTENSION_REGEX) !== null;
};

export const isYouTubeLink = (value: string): boolean => {
	return value.match(YOUTUBE_LINK_REGEX) !== null;
};

export const isTwitterLink = (value: string): boolean => {
	return value.match(TWITTER_LINK_REGEX) !== null;
};

export const isNumberCalcuation = (
	value: GeneralCalculation | NumberCalculation
): value is NumberCalculation => {
	return Object.values(NumberCalculation).includes(
		value as NumberCalculation
	);
};
