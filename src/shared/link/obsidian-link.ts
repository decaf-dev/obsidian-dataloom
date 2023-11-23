export const extractObsidianLinkComponents = (
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

export const linkComponentsToObsidianLink = (
	path: string,
	alias: string | null
): string => {
	if (alias === null) return `[[${path}]]`;
	return `[[${path}|${alias}]]`;
};
