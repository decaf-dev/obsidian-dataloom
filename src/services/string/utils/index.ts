import { isNumber, isDate, isCheckbox } from "../validators";
import { CellType } from "src/services/state/types";

/**
 * Finds a content type.
 * If the content is empty it will return the content type of the column
 * where the content's cell resides.
 * @param content The cell content.
 * @param columnContentType The content type of each cell in the column.
 * @returns The type of the content.
 */
export const findContentType = (content: string, columnContentType: string) => {
	if (content === "") return columnContentType;
	if (columnContentType === CellType.TEXT) return CellType.TEXT;
	if (columnContentType === CellType.TAG) return CellType.TAG;
	if (isNumber(content)) return CellType.NUMBER;
	if (isDate(content)) return CellType.DATE;
	if (isCheckbox(content)) return CellType.CHECKBOX;
	return CellType.TEXT;
};
