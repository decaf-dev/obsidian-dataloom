import {
	isMarkdownFile,
	stripDirectory,
	stripFileExtension,
} from "../link-and-path/file-path-utils";
import { componentsToWikiLink } from "../link-and-path/markdown-link-utils";

export const getSourceFileContent = (
	path: string,
	shouldRemoveMarkdown = false
) => {
	if (shouldRemoveMarkdown) return path;
	if (path === "") return "";

	let fileName = stripDirectory(path);
	if (isMarkdownFile(path)) {
		fileName = stripFileExtension(fileName);
	}

	return componentsToWikiLink(fileName, null);
};
