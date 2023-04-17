export const replaceNewLinesWithBreakTag = (markdown: string) => {
	let endsWithNewLine = false;
	if (markdown.endsWith("\n")) endsWithNewLine = true;

	const updated = markdown.replace(/\n/g, "<br>");

	//If we end with a \n tag then add an extra break tag.
	//This is because the MarkdownRenderer.renderMarkdown function won't render the last <br> tag
	if (endsWithNewLine) return updated + "<br>";
	return updated;
};
