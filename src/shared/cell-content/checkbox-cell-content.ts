import {
	CHECKBOX_MARKDOWN_CHECKED,
	CHECKBOX_MARKDOWN_UNCHECKED,
} from "../markdown/constants";

export const getCheckboxCellContent = (
	value: boolean,
	shouldRemoveMarkdown: boolean
) => {
	if (shouldRemoveMarkdown) {
		if (value) return "true";
		return "false";
	}
	return value ? CHECKBOX_MARKDOWN_CHECKED : CHECKBOX_MARKDOWN_UNCHECKED;
};
