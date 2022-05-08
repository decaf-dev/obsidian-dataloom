import { toFileLink } from "../toLink";
import { stripSquareBrackets } from "../strippers";
import { matchURLs } from "../matchers";
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
