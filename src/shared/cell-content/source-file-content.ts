import { getBasename } from "../link/link-utils";

export const getSourceFileContent = (
	content: string | null,
	shouldRemoveMarkdown: boolean
) => {
	if (content === null) return "";
	if (shouldRemoveMarkdown) return content;

	const basename = getBasename(content);

	return `[[${content}|${basename}]]`;
};
