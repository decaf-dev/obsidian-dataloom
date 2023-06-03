import { EXTENSION_REGEX } from "./constants";

/**
 * Matches all wiki links
 * [[my-file]]: Matches the pattern with only the filename.
 * [[my-file|alias]]: Matches the pattern with both the filename and the alias.
 * [[my-file|]]: Matches the pattern with the filename and an empty alias.
 */
const WIKI_LINK_REGEX = new RegExp(/\[\[([^|\]]+)(?:\|([\w-]+))?\]\]/g);

export const splitFileExtension = (
	filePath: string
): [string, string] | null => {
	if (filePath.match(EXTENSION_REGEX)) {
		const periodIndex = filePath.lastIndexOf(".");
		return [
			filePath.substring(0, periodIndex),
			filePath.substring(periodIndex),
		];
	}
	return null;
};

export const updateWikiLinks = (
	markdown: string,
	oldFilePath: string,
	newFilePath: string
) => {
	return markdown.replace(WIKI_LINK_REGEX, (match, fileName, alias) => {
		const fileNameWithExtension = fileName.endsWith(".md")
			? fileName
			: fileName + ".md";
		if (fileNameWithExtension === oldFilePath)
			return `[[${newFilePath}${alias ? "|" + alias : ""}]]`;
		return match;
	});
};
