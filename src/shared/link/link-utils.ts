import { VaultFile } from "src/obsidian-shim/development/vault-file";

/**
 * Get basename
 */
export const getBasename = (filePath: string): string => {
	const fileName = stripDirectory(filePath);
	return stripFileExtension(fileName);
};

/**
 * Removes the file extension from a file path
 * @param filePath the file path
 */
export const stripFileExtension = (filePath: string): string => {
	return filePath.substring(0, filePath.lastIndexOf("."));
};

/**
 * Removes the directory from a file path
 * @param filePath the file path
 */
export const stripDirectory = (filePath: string): string => {
	return filePath.substring(filePath.lastIndexOf("/") + 1);
};

/**
 * Returns whether or not the extension is that of a markdown file
 * @param extension the file extension without a period
 */
export const isMarkdownFile = (extension: string) => {
	return extension === "md";
};

/**
 * Gets the text for a wiki link, which may include the path and an alias
 * @param fileInfo the file info
 * @param isFileNameUnique whether the file name (which doesn't include the directory) is unique across all vault files
 */
export const getWikiLinkText = (
	fileInfo: Pick<VaultFile, "basename" | "name" | "path" | "extension">
) => {
	const { basename, name, path, extension } = fileInfo;
	//The initial name is the basename, which doesn't include an extension
	let text = basename;

	if (!isMarkdownFile(extension)) {
		//If the file is a not markdown file, use the name, which includes the extension
		text = name;

		if (path.includes("/")) text = `${path}|${basename}`;
	} else {
		//If the file is a markdown file, use the path without the extension
		const pathWithoutExtension = stripFileExtension(path);
		if (path.includes("/")) text = `${pathWithoutExtension}|${basename}`;
	}
	return text;
};
