import {
	EXTERNAL_LINK_REGEX,
	FILE_LINK_REGEX,
	UNDERLINE_CHARACTER_REGEX,
	UNDERLINE_CHARACTER_PIECES_REGEX,
	BOLD_CHARACTER_STRONG_REGEX,
	BOLD_CHARACTER_B_REGEX,
	BOLD_CHARACTER_B_PIECES_REGEX,
	BOLD_CHARACTER_STRONG_PIECES_REGEX,
	BOLD_MARKDOWN_REGEX,
	ITALIC_CHARACTER_I_REGEX,
	ITALIC_CHARACTER_EM_REGEX,
	ITALIC_MARKDOWN_REGEX,
	ITALIC_CHARACTER_EM_PIECES_REGEX,
	ITALIC_CHARACTER_I_PIECES_REGEX,
	HIGHLIGHT_CHARACTER_REGEX,
	HIGHLIGHT_CHARACTER_PIECES_REGEX,
	HIGHLIGHT_MARKDOWN_REGEX,
	HIGHLIGHT_MARKDOWN_PIECES_REGEX,
	BOLD_MARKDOWN_PIECES_REGEX,
	ITALIC_MARKDOWN_PIECES_REGEX,
} from "../regex";
import { isNumber, isTag, isDate, isCheckBox } from "../validators";
import { CELL_TYPE } from "src/app/constants";

export const matchBoldMarkdown = (input: string) => {
	return input.match(BOLD_MARKDOWN_REGEX("g")) || [];
};

export const matchItalicMarkdown = (input: string) => {
	return input.match(ITALIC_MARKDOWN_REGEX("g")) || [];
};

export const matchHighlightMarkdown = (input: string) => {
	return input.match(HIGHLIGHT_MARKDOWN_REGEX("g")) || [];
};

export const matchBoldMarkdownPieces = (input: string) => {
	return input.match(BOLD_MARKDOWN_PIECES_REGEX) || [];
};

export const matchItalicMarkdownPieces = (input: string) => {
	return input.match(ITALIC_MARKDOWN_PIECES_REGEX) || [];
};

export const matchHighlightMarkdownPieces = (input: string) => {
	return input.match(HIGHLIGHT_MARKDOWN_PIECES_REGEX) || [];
};

export const matchBoldTags = (input: string) => {
	return [
		...(input.match(BOLD_CHARACTER_B_REGEX("g")) || []),
		...(input.match(BOLD_CHARACTER_STRONG_REGEX("g")) || []),
	];
};

export const matchBoldTagBPieces = (input: string): RegExpMatchArray => {
	return input.match(BOLD_CHARACTER_B_PIECES_REGEX);
};

export const matchBoldTagStrongPieces = (input: string): RegExpMatchArray => {
	return input.match(BOLD_CHARACTER_STRONG_PIECES_REGEX);
};

export const matchItalicTags = (input: string) => {
	return [
		...(input.match(ITALIC_CHARACTER_I_REGEX("g")) || []),
		...(input.match(ITALIC_CHARACTER_EM_REGEX("g")) || []),
	];
};

export const matchItalicTagEmPieces = (input: string) => {
	return input.match(ITALIC_CHARACTER_EM_PIECES_REGEX) || [];
};

export const matchItalicTagIPieces = (input: string) => {
	return input.match(ITALIC_CHARACTER_I_PIECES_REGEX) || [];
};

export const matchHighlightTags = (input: string) => {
	return input.match(HIGHLIGHT_CHARACTER_REGEX("g")) || [];
};

export const matchHighlightTagPieces = (input: string) => {
	return input.match(HIGHLIGHT_CHARACTER_PIECES_REGEX) || [];
};

export const matchUnderlineTags = (input: string) => {
	return input.match(UNDERLINE_CHARACTER_REGEX("g")) || [];
};

export const matchUnderlineTagPieces = (input: string) => {
	return input.match(UNDERLINE_CHARACTER_PIECES_REGEX) || [];
};

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

export const findCellType = (content: string, headerType: string) => {
	if (content === "") return headerType;
	if (headerType === CELL_TYPE.TEXT) return CELL_TYPE.TEXT;
	if (isNumber(content)) return CELL_TYPE.NUMBER;
	if (isTag(content)) return CELL_TYPE.TAG;
	if (isDate(content)) return CELL_TYPE.DATE;
	if (isCheckBox(content)) return CELL_TYPE.CHECKBOX;
	return CELL_TYPE.TEXT;
};
