import { getResourcePath } from "src/shared/render-utils";
import { App } from "obsidian";
import { isObsidianLink } from "../link-and-path/link-predicates";

/**
 * Gets the embed cell content
 * @param renderMarkdown Whether not we should render markdown
 * @param isExternalLink Whether or not the link is external
 * @param value The value of the cell
 */
export const getEmbedCellContent = (
	app: App,
	pathOrUrl: string,
	options?: {
		shouldRemoveMarkdown?: boolean;
		isExternal?: boolean;
		isExport?: boolean;
	}
) => {
	const {
		shouldRemoveMarkdown = false,
		isExternal = false,
		isExport = false,
	} = options ?? {};

	if (shouldRemoveMarkdown) return pathOrUrl;
	if (pathOrUrl === "") return pathOrUrl;

	if (isExternal) {
		if (isObsidianLink(pathOrUrl)) {
			return `![](${pathOrUrl})`;
		}
		return `<iframe src="${pathOrUrl}"></iframe>`;
	}

	//Export will use the normal embedded image syntax
	if (isExport) return `![[${pathOrUrl}]]`;
	//In order to render with `MarkdownRenderer.renderMarkdown`, we need to use the `![]()` syntax
	return `![](${getResourcePath(app, pathOrUrl)})`;
};
