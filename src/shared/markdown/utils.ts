export const replaceNewLinesWithBr = (markdown: string) => {
	const lines = markdown.split("\n");
	let updated = "";
	lines.forEach((line) => {
		//If the line is empty, that means we want to render just a new line
		//The MarkdownRenderer.renderMarkdown function does not render a \n character with no other text before it
		//to do that we need to add a <br> tag
		//We still need the \n character however to make sure that lists are rendered properly
		if (line === "") {
			updated += "<br>";
		} else {
			updated += line + "\n";
		}
	});
	return updated;
};
