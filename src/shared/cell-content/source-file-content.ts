import { componentsToWikiLink } from "../link-and-path/markdown-link-utils";

export const getSourceFileContent = (
	content: string,
	shouldRemoveMarkdown = false
) => {
	if (shouldRemoveMarkdown) return content;
	if (content === "") return "";

	return componentsToWikiLink(content, null);
};
