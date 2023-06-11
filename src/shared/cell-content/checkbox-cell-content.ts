import { isCheckboxChecked } from "../validators";

export const getCheckboxCellContent = (markdown: string) => {
	if (isCheckboxChecked(markdown)) return "true";
	return "false";
};
