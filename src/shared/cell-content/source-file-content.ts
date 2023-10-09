import { getBasename } from "../link/link-utils";

export const getSourceFileContent = (
	content: string,
	shouldRemoveMarkdown = false
) => {
	if (content === "") return "";
	if (shouldRemoveMarkdown) return content;

	const basename = getBasename(content);

	return `[[${content}|${basename}]]`;
};
