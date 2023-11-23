export const getFileCellContent = (
	path: string,
	shouldRemoveMarkdown: boolean
) => {
	if (shouldRemoveMarkdown) {
		return path;
	}
	return `[[${path}]]`;
};
