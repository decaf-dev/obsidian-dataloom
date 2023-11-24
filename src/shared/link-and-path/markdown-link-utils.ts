import { App, TFile } from "obsidian";

export const extractWikiLinkComponents = (
	markdown: string
): {
	path: string | null;
	alias: string | null;
} => {
	// Check if the link is in the correct format
	if (!markdown.startsWith("[[") || !markdown.endsWith("]]")) {
		return { path: null, alias: null };
	}

	// Remove the brackets
	const content = markdown.slice(2, -2);

	// Check for empty content
	if (content.length === 0) {
		return { path: null, alias: null };
	}

	// Split the content by '|'
	const parts = content.split("|");

	// Check for malformed path
	if (parts[0] === "") {
		return { path: null, alias: null };
	}

	// Extract path and alias
	const path = parts[0];

	// Initialize alias as null
	let alias: string | null = null;

	// Check and set alias if available
	if (parts.length > 1 && parts[1] !== "") {
		alias = parts[1];
	}

	return { path, alias };
};

export const componentsToWikiLink = (
	path: string,
	alias: string | null
): string => {
	if (alias === null) return `[[${path}]]`;
	return `[[${path}|${alias}]]`;
};

/**
 * Gets the minimal wiki link for a file
 *
 * If there are two files in a vault, one with the path `/test` and the other `/folder/test`, then the minimal wiki link is `[[test]]` for the first file and `[[folder/test]]` for the second file.
 * If there is only one file with the path `/folder/test`, then the minimal wiki link is `[[test]]`.
 * @param app - The Obsidian App instance
 * @param file - The file to get the minimal wiki link for
 * @param appFile - The app file where the link is mounted
 * @param alias - The alias for the link
 * @returns
 */
export const getMinimalWikiLink = (
	app: App,
	file: TFile,
	appFile: TFile,
	alias: string | undefined
): string => {
	return app.fileManager.generateMarkdownLink(
		file,
		appFile.path,
		undefined,
		alias
	);
};
