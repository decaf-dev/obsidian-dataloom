import { MARKDOWN_EXTENSION } from "./constants";

export const getFileName = (path: string): string => {
	const split = path.split("/");
	if (split.length === 0) return "";

	const fileName = split[split.length - 1];

	// Check if there's a period in the file name
	if (fileName.includes(".")) {
		// Return the file name without the extension
		return fileName.substring(0, fileName.lastIndexOf("."));
	}
	return fileName;
};

/**
 * Gets the name of a file without the directory or extension
 */
export const getBasename = (filePath: string): string => {
	const fileName = stripDirectory(filePath);
	return stripFileExtension(fileName);
};

/**
 * Checks if a file is a markdown file
 * A markdown file has the extension "md"
 * @param extension the file extension without a period
 */
export const isMarkdownFile = (path: string) => {
	return path.endsWith(`.${MARKDOWN_EXTENSION}`);
};

/**
 * Gets the file extension without the leading period
 * @param filePath the file path
 */
export const getFileExtension = (filePath: string): string => {
	return filePath.substring(filePath.lastIndexOf(".") + 1);
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
