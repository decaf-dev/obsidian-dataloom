import { CellType } from "../../data/types";
import { IconType } from "./types";

export const getIconTypeFromCellType = (type: CellType) => {
	switch (type) {
		case CellType.TEXT:
			return IconType.NOTES;
		case CellType.NUMBER:
			return IconType.NUMBERS;
		case CellType.CHECKBOX:
			return IconType.CHECK;
		case CellType.CREATION_TIME:
		case CellType.LAST_EDITED_TIME:
			return IconType.SCHEDULE;
		case CellType.TAG:
			return IconType.LABEL;
		case CellType.MULTI_TAG:
			return IconType.LIST;
		case CellType.DATE:
			return IconType.SCHEDULE;
		case CellType.CURRENCY:
			return IconType.PAYMENTS;
		default:
			return IconType.NOTES;
	}
};
