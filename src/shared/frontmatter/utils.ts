import { CellType } from "src/shared/loom-state/types/loom-state";
import { ObsidianPropertyType } from "./types";

export const getAcceptedFrontmatterTypes = (
	type: CellType
): ObsidianPropertyType[] => {
	switch (type) {
		case CellType.TEXT:
		case CellType.EMBED:
		case CellType.FILE:
		case CellType.TAG:
			return [ObsidianPropertyType.TEXT];
		case CellType.NUMBER:
			return [ObsidianPropertyType.NUMBER];
		case CellType.DATE:
			return [ObsidianPropertyType.DATE, ObsidianPropertyType.DATETIME];
		case CellType.CHECKBOX:
			return [ObsidianPropertyType.CHECKBOX];
		case CellType.MULTI_TAG:
			return [
				ObsidianPropertyType.ALIASES,
				ObsidianPropertyType.MULTITEXT,
				ObsidianPropertyType.TAGS,
			]; //CSSclasses may change from Multitext to its own type in the future
		case CellType.CREATION_TIME:
		case CellType.LAST_EDITED_TIME:
		case CellType.SOURCE:
		case CellType.SOURCE_FILE:
			return [];
		default:
			throw new Error(`Cell type ${type} not handled`);
	}
};
