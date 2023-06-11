import { WIKI_LINK_REGEX } from "src/data/constants";

export const getTextCellContent = (
	markdown: string,
	renderMarkdown: boolean
) => {
	if (!renderMarkdown)
		return markdown.replace(WIKI_LINK_REGEX, (_match, path) => {
			return path;
		});
	return markdown;
};
