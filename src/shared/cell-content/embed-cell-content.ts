import { isURL } from "../validators";

export const getEmbedCellContent = (
	markdown: string,
	renderMarkdown: boolean
) => {
	if (isURL(markdown)) {
		if (renderMarkdown) return `![](${markdown})`;
		return markdown;
	}
	return "";
};
