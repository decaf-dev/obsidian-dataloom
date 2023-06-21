import { isImage, isTwitterLink, isYouTubeLink } from "../match";

/**
 * Gets the embed cell content
 * @param renderMarkdown Whether not we should render markdown
 * @param isExternalLink Whether or not the link is external
 * @param value The value of the cell
 */
export const getEmbedCellContent = (
	renderMarkdown: boolean,
	isExternalLink: boolean,
	value: string
) => {
	if (renderMarkdown) {
		if (isExternalLink) {
			if (
				isImage(value) ||
				isYouTubeLink(value) ||
				isTwitterLink(value)
			) {
				return `![](${value})`;
			}
			if (value !== "") return "Unsupported link";
		}
	}
	return value;
};
