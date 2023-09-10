import { isCheckboxChecked } from "../match";

export const getCheckboxCellContent = (
	markdown: string,
	shouldRemoveMarkdown: boolean
) => {
	if (shouldRemoveMarkdown) {
		if (isCheckboxChecked(markdown)) return "true";
		return "false";
	}
	return markdown;
};
