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
	return link.startsWith("obsidian://");
};

export const isHttpLink = (link: string) => {
	return link.startsWith("http://") || link.startsWith("https://");
};
