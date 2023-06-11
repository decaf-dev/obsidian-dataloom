export const getFileCellContent = (markdown: string) => {
	if (markdown === "") return markdown;

	const linkRegex = new RegExp(/\[\[([^[\]]+)\]\]/);
	const matches = markdown.match(linkRegex);

	let matchStartIndex = -1;
	let matchEndIndex = -1;
	if (matches) {
		matchStartIndex = markdown.indexOf(matches[0]);
		matchEndIndex = matchStartIndex + matches[0].length;
	}

	// If the markdown does not contain a link
	// then create a link
	if (matches === null) {
		return `[[${markdown}]]`;
		//If the markdown contains a link, and there is no other text starting, get the first link
	} else if (matchStartIndex === 0) {
		return `${markdown.slice(0, matchEndIndex + 1).trim()}`;
		//Otherwise get the text before the first link and start
	} else {
		return `[[${markdown.slice(0, matchStartIndex).trim()}]]`;
	}
};
