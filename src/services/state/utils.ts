import { NUMBER_REGEX } from "src/services/string/regex";
import { isCheckbox, isNumber, isDate } from "src/services/string/validators";
import { CellType } from "./types";

export const isValidCellContent = (
	content: string,
	cellType: CellType
): boolean => {
	switch (cellType) {
		case CellType.NUMBER:
			return isNumber(content);
		case CellType.DATE:
			return isDate(content);
		case CellType.CHECKBOX:
			return isCheckbox(content);
		default:
			return false;
	}
};

export const filterNumberFromContent = (content: string) => {
	let result = "";
	for (let i = 0; i < content.length; i++) {
		if (content[i].match(NUMBER_REGEX)) result += content[i];
	}
	return result;
};

export const checkboxToContent = (content: string) => {
	if (isCheckbox(content)) {
		if (content.includes("x")) {
			return "Yes";
		} else {
			return "No";
		}
	} else {
		return content;
	}
};

export const contentToCheckbox = (content: string) => {
	if (content === "Yes") {
		return "[x]";
	} else if (content == "No") {
		return "[ ]";
	} else {
		return content;
	}
};
