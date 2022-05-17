import { toFileLink } from "../toLink";
import { stripSquareBrackets } from "../strippers";
import {
	matchURLs,
	matchFileLinks,
	matchBoldTags,
	matchBoldTagPieces,
	matchItalicTags,
	matchItalicTagPieces,
	matchUnderlineTagPieces,
	matchUnderlineTags,
	matchHighlightTagPieces,
	matchHighlightTags,
} from "../matchers";
import { toExternalLink } from "../toLink";
import {
	BOLD_TAG_MARKDOWN,
	ITALIC_TAG_MARKDOWN,
	HIGHLIGHT_TAG_MARKDOWN,
	UNDERLINE_TAG_START,
	UNDERLINE_TAG_CLOSE,
} from "src/app/constants";

export const parseFileLinks = (input: string): string => {
	const matches = matchFileLinks(input);
	matches.forEach((match) => {
		const replacement = toFileLink(stripSquareBrackets(match));
		input = input.replace(match, replacement);
	});
	return input;
};

export const parseURLs = (input: string): string => {
	const matches = matchURLs(input);
	matches.forEach((match) => {
		const replacement = toExternalLink(match);
		input = input.replace(match, replacement);
	});
	return input;
};

export const parseBoldTags = (input: string): string => {
	const matches = matchBoldTags(input);
	matches.forEach((match) => {
		let replacement = match;
		const pieces = matchBoldTagPieces(match);
		if (pieces.length >= 3) {
			replacement = replacement.replace(pieces[1], BOLD_TAG_MARKDOWN);
			replacement = replacement.replace(pieces[2], BOLD_TAG_MARKDOWN);
		}
		input = input.replace(match, replacement);
	});
	return input;
};

export const parseItalicTags = (input: string): string => {
	const matches = matchItalicTags(input);
	matches.forEach((match) => {
		let replacement = match;
		const pieces = matchItalicTagPieces(match);
		if (pieces.length >= 3) {
			replacement = replacement.replace(pieces[1], ITALIC_TAG_MARKDOWN);
			replacement = replacement.replace(pieces[2], ITALIC_TAG_MARKDOWN);
		}
		input = input.replace(match, replacement);
	});
	return input;
};

export const parseHighlightTags = (input: string): string => {
	const matches = matchHighlightTags(input);
	matches.forEach((match) => {
		let replacement = match;
		const pieces = matchHighlightTagPieces(match);
		if (pieces.length >= 3) {
			replacement = replacement.replace(
				pieces[1],
				HIGHLIGHT_TAG_MARKDOWN
			);
			replacement = replacement.replace(
				pieces[2],
				HIGHLIGHT_TAG_MARKDOWN
			);
		}
		input = input.replace(match, replacement);
	});
	return input;
};

export const parseUnderlineTags = (input: string): string => {
	const matches = matchUnderlineTags(input);
	matches.forEach((match) => {
		let replacement = match;
		const pieces = matchUnderlineTagPieces(match);
		if (pieces.length >= 3) {
			replacement = replacement.replace(pieces[1], UNDERLINE_TAG_START);
			replacement = replacement.replace(pieces[2], UNDERLINE_TAG_CLOSE);
		}
		input = input.replace(match, replacement);
	});
	return input;
};

export const parseInputDate = (date: string): Date => {
	//We need to replace hyphens with slashes to not by 1 day off
	//See: https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
	return new Date(date.replace(/-/g, "/"));
};

export const parseDateForInput = (date: string): string => {
	let d = null;
	if (date == "") {
		d = new Date();
	} else {
		d = new Date(date);
	}
	const day = ("0" + d.getDate()).slice(-2);
	const month = ("0" + (d.getMonth() + 1)).slice(-2);
	const year = d.getFullYear();
	return `${year}-${month}-${day}`;
};
