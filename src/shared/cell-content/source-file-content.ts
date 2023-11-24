import {
	isMarkdownFile,
	stripFileExtension,
} from "../link-and-path/file-path-utils";
import { componentsToWikiLink } from "../link-and-path/markdown-link-utils";

export const getSourceFileContent = (
	path: string,
	shouldRemoveMarkdown = false
) => {
	if (shouldRemoveMarkdown) return path;
	if (path === "") return "";

	if (isMarkdownFile(path)) {
		path = stripFileExtension(path);
	}

	return componentsToWikiLink(path, null);
};
