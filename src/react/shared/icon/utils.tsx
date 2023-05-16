import { CellType } from "src/shared/table-state/types";

export const getIconIdForCellType = (type: CellType) => {
	switch (type) {
		case CellType.TEXT:
			return "text";
		case CellType.NUMBER:
			return "hash";
		case CellType.CHECKBOX:
			return "check-square";
		case CellType.CREATION_TIME:
		case CellType.LAST_EDITED_TIME:
			return "clock-2";
		case CellType.TAG:
			return "tag";
		case CellType.MULTI_TAG:
			return "tags";
		case CellType.DATE:
			return "calendar";
		case CellType.CURRENCY:
			return "coins";
		default:
			return "text";
	}
};
