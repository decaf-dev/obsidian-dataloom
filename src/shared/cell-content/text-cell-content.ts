import markdownIt from "markdown-it";
import { WIKI_LINK_REGEX } from "src/data/constants";
import * as htmlparser2 from "htmlparser2";

const getInnerHTML = (htmlText: string) => {
	let allInnerText = "";

	const parser = new htmlparser2.Parser({
		ontext: (text) => {
			allInnerText += text;
		},
	});

	parser.write(htmlText);
	parser.end();
	return allInnerText.trim();
};

const markdownToHTML = (markdown: string) => {
	const md = markdownIt();
	return md.render(markdown);
};

export const getTextCellContent = (
	content: string,
	shouldRemoveMarkdown: boolean
) => {
	if (shouldRemoveMarkdown) {
		const replaced = content.replace(
			WIKI_LINK_REGEX,
			(_match, path) => path
		);
		const html = markdownToHTML(replaced);
		const innerHTML = getInnerHTML(html);
		return innerHTML;
	}
	return content;
};
