import { getBasename } from "../link/link-utils";

export const getSourceFileContent = (
	content: string,
	shouldRemoveMarkdown = false
) => {
	if (shouldRemoveMarkdown) return content;
	if (content === "") return "";

	const basename = getBasename(content);

	return `[[${content}|${basename}]]`;
};
