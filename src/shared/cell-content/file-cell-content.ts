import { componentsToWikiLink } from "../link-and-path/markdown-link-utils";

export const getFileCellContent = (
	path: string,
	shouldRemoveMarkdown: boolean
) => {
	if (shouldRemoveMarkdown) {
		return path;
	}
	return componentsToWikiLink(path, null);
};
