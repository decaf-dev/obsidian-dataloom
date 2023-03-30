import { UNESCAPED_PIPE_REGEX } from "../string/regex";

export const replaceUnescapedPipes = (markdown: string): string => {
	const matches = Array.from(markdown.matchAll(UNESCAPED_PIPE_REGEX));
	matches.forEach((match) => {
		const pipe = match[0];
		markdown = markdown.replace(pipe, pipe[0] + "\\|");
	});
	return markdown;
};
