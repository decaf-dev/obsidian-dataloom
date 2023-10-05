import { CellType } from "src/shared/loom-state/types/loom-state";
import { FrontMatterType } from "./types";

export const cellTypeToFrontMatterKeyType = (
	type: CellType
): FrontMatterType | null => {
	switch (type) {
		case CellType.TEXT:
		case CellType.EMBED:
		case CellType.FILE:
		case CellType.TAG:
			return "text";
		case CellType.NUMBER:
		case CellType.DATE:
			return "number";
		case CellType.CHECKBOX:
			return "boolean";
		case CellType.MULTI_TAG:
			return "array";
		case CellType.CREATION_TIME:
		case CellType.LAST_EDITED_TIME:
		case CellType.SOURCE:
		case CellType.SOURCE_FILE:
			return null;
		default:
			throw new Error(`Cell type not handled: ${type}`);
	}
};
