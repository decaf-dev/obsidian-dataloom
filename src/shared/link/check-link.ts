export const isExternalLink = (link: string) => {
	if (isUrlLink(link)) return true;
	if (isObsidianLink(link)) return false;
	return false;
};

export const isRelativePath = (link: string) => {
	return !isUrlLink(link);
};

export const isUrlLink = (link: string) => {
	if (isHttpLink(link)) return true;
	if (isObsidianLink(link)) return true;
	return false;
};

export const isObsidianLink = (link: string) => {
	// Check if the link starts with 'obsidian://'
	if (link.startsWith("obsidian://")) {
		return true;
	}
	return false;
};

export const isHttpLink = (link: string) => {
	// Check if the link starts with 'http://' or 'https://'
	if (link.startsWith("http://") || link.startsWith("https://")) {
		return true;
	}
	return false;
};
