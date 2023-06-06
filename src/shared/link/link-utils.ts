import { TFile } from "obsidian";

/**
 * Removes the file extension from a file path if it exists
 * @param filePath the file path which includes the directory, file name, and extension
 * @returns
 */
export const stripFileExtension = (filePath: string): string => {
	return filePath.substring(0, filePath.lastIndexOf("."));
};

export const isMarkdownFile = (extension: string) => {
	return extension === "md";
};

/**
 * Gets the text for a wiki link, which may include the path and an alias
 * @param fileInfo the file info
 * @param isFileNameUnique whether the file name (which doesn't include the directory) is unique across all vault files
 */
export const getWikiLinkText = (
	fileInfo: Pick<TFile, "basename" | "name" | "path" | "extension">,
	isFileNameUnique: boolean
) => {
	const { basename, name, path, extension } = fileInfo;
	//The initial name is the basename, which doesn't include an extension
	let text = basename;

	if (!isMarkdownFile(extension)) {
		//If the file is a not markdown file, use the name, which includes the extension
		text = name;

		//If the file is not unique, include the entire path
		if (!isFileNameUnique) text = `${path}|${basename}`;
	} else {
		//If the file is a markdown file, use the path without the extension
		const pathWithoutExtension = stripFileExtension(path);
		if (!isFileNameUnique) text = `${pathWithoutExtension}|${basename}`;
	}
	return text;
};
