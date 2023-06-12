import { isCheckboxChecked } from "../validators";

export const getCheckboxCellContent = (
	markdown: string,
	renderMarkdown: boolean
) => {
	if (renderMarkdown) return markdown;

	if (isCheckboxChecked(markdown)) return "true";
	return "false";
};
