import { isCheckboxChecked } from "../match";

export const getCheckboxCellContent = (
	content: string,
	shouldRemoveMarkdown: boolean
) => {
	if (shouldRemoveMarkdown) {
		if (isCheckboxChecked(content)) return "true";
		return "false";
	}
	return content;
};
