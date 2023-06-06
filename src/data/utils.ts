import {
	getWikiLinkText,
	stripFileExtension,
} from "src/shared/link/link-utils";
import { EXTENSION_REGEX, WIKI_LINK_REGEX } from "./constants";
import { TFile } from "obsidian";

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

export const stripAbsolutePath = (filePath: string): string => {
	return filePath.substring(filePath.lastIndexOf("/") + 1);
};

export const updateLinkReferences = (
	markdown: string,
	updatedFileInfo: Pick<TFile, "basename" | "path" | "name" | "extension">,
	oldPath: string,
	isFileNameUnique: boolean
) => {
	//Create a replace function for the markdown
	return markdown.replace(WIKI_LINK_REGEX, (match, path) => {
		//The path may or may not contain a file extension
		//It also may or may not contain a slash, depending on if its a relative or absolute path
		let comparePath = oldPath;
		if (!path.includes("/")) comparePath = stripAbsolutePath(comparePath);

		if (!path.match(EXTENSION_REGEX))
			comparePath = stripFileExtension(comparePath);

		if (comparePath === path) {
			const linkText = getWikiLinkText(updatedFileInfo, isFileNameUnique);
			return `[[${linkText}]]`;
		}
		return match;
	});
};
