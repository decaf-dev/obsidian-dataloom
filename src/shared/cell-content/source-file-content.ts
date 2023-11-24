export const getSourceFileContent = (
	content: string,
	shouldRemoveMarkdown = false
) => {
	if (shouldRemoveMarkdown) return content;
	if (content === "") return "";

	return `[[${content}]]`;
};
