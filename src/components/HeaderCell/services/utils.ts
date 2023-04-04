import { IconType } from "src/services/icon/types";
import { CellType } from "src/services/tableState/types";

export const getIconTypeFromCellType = (type: CellType) => {
	switch (type) {
		case CellType.TEXT:
			return IconType.DESCRIPTION;
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
		default:
			return IconType.DESCRIPTION;
	}
};
