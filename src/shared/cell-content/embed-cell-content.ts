import { getResourcePath } from "src/obsidian-shim/development/render-utils";
import { isImage, isTwitterLink, isYouTubeLink } from "../match";

/**
 * Gets the embed cell content
 * @param renderMarkdown Whether not we should render markdown
 * @param isExternalLink Whether or not the link is external
 * @param value The value of the cell
 */
export const getEmbedCellContent = (
	value: string,
	options?: {
		shouldRenderMarkdown?: boolean;
		isExternalLink?: boolean;
		isExport?: boolean;
	}
) => {
	const {
		shouldRenderMarkdown = true,
		isExternalLink = false,
		isExport = false,
	} = options ?? {};

	if (shouldRenderMarkdown) {
		if (isExternalLink) {
			if (
				isImage(value) ||
				isYouTubeLink(value) ||
				isTwitterLink(value)
			) {
				return `![](${value})`;
			}
			if (value !== "") return "Unsupported link";
		} else {
			if (value !== "") {
				//Export will use the normal embedded image syntax
				if (isExport) return `![[${value}]]`;
				//In order to render with `MarkdownRenderer.renderMarkdown`, we need to use the `![]()` syntax
				return `![](${getResourcePath(value)})`;
			}
		}
	}
	return value;
};
