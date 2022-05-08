/**
 * Converts file name to an external hyperlink
 * @param url The url
 * @returns A hyperlink (<a>) link for an Obsidian file
 */
export const toExternalLink = (url: string): string => {
	return `<a tabIndex={-1} href="${url}" target="_blank" rel="noopener">${url}</a>`;
};

/**
 * Converts file name to an Obsidian file hyperlink
 * @param fileName The file name without double square brackets
 * @returns A hyperlink (<a>) link for an Obsidian file
 */
export const toFileLink = (fileName: string): string => {
	return `<a tabIndex={-1} data-href="${fileName}" href="${fileName}" class="internal-link" target="_blank" rel="noopener">${fileName}</a>`;
};

/**
 * Converts tag name to an Obsidian tag hyperlink
 * @param tagName The tagName
 * @returns A hyperlink (<a>) for an Obsidian tag
 */
export const toTagLink = (tagName: string): string => {
	if (tagName.startsWith("#")) throw "tagName cannot start with pound symbol";
	return `<a tabIndex={-1} href="#${tagName}" class="tag" target="_blank" rel="noopener">#${tagName}</a>`;
};
