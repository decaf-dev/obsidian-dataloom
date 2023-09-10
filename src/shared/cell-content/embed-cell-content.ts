import { getResourcePath } from "src/shared/render-utils";
import { isImage, isTwitterLink, isYouTubeLink } from "../match";
import { App } from "obsidian";

/**
 * Gets the embed cell content
 * @param renderMarkdown Whether not we should render markdown
 * @param isExternalLink Whether or not the link is external
 * @param value The value of the cell
 */
export const getEmbedCellContent = (
	app: App,
	value: string,
	options?: {
		shouldRemoveMarkdown?: boolean;
		isExternalLink?: boolean;
		isExport?: boolean;
	}
) => {
	const {
		shouldRemoveMarkdown = false,
		isExternalLink = false,
		isExport = false,
	} = options ?? {};
	if (shouldRemoveMarkdown || value === "") {
		return value;
	}

	if (isExternalLink) {
		if (isImage(value) || isYouTubeLink(value) || isTwitterLink(value)) {
			return `![](${value})`;
		}
		return "Unsupported link";
	} else {
		//Export will use the normal embedded image syntax
		if (isExport) return `![[${value}]]`;
		//In order to render with `MarkdownRenderer.renderMarkdown`, we need to use the `![]()` syntax
		return `![](${getResourcePath(app, value)})`;
	}
};
