import { toFileLink } from "../toLink";
import { stripSquareBrackets } from "../strippers";
import { matchURLs, matchFileLinks } from "../matchers";
import { toExternalLink } from "../toLink";

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

export const parseInputDate = (date: string): Date => {
	return new Date(date);
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
