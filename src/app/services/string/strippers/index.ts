export const stripLink = (input: string) => {
	const replaceWithSquareBrackets =
		(input.match(/class="internal-link"/) || []).length !== 0;
	return input
		.replace(/&lt;a.*?&gt;/, replaceWithSquareBrackets ? "[[" : "")
		.replace(/&lt;\/a&gt;/, replaceWithSquareBrackets ? "]]" : "");
};

/**
 * Removes all hyperlinks from input string
 * @param input The input string
 * @returns A string with no hyperlinks (<a>)
 */
export const stripLinks = (input: string): string => {
	const matches = input.match(/&lt;a.*?&gt;.*?&lt;\/a&gt;/g) || [];
	matches.forEach((match) => {
		input = input.replace(match, stripLink(match));
	});
	return input;
};

/**
 * Removes double square brackets from input string
 * @param input The input string
 * @returns A string without double square brackets ([[ ]])
 */
export const stripSquareBrackets = (input: string): string => {
	input = input.replace(/^\[\[/, "");
	input = input.replace(/]]$/, "");
	return input;
};

export const sanitizeHTML = (innerHTML: string) => {
	const temp = document.createElement("div");
	temp.textContent = innerHTML;
	return temp.innerHTML;
};
