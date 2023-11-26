import { ObsidianPropertyType } from "src/shared/frontmatter/types";
import { CellType, SourceType } from "src/shared/loom-state/types/loom-state";

export const getIconIdForSourceType = (
	type: SourceType,
	options?: {
		propertyType?: ObsidianPropertyType;
	}
) => {
	const { propertyType } = options ?? {};

	if (type === SourceType.FOLDER) {
		return "folder";
	} else if (type === SourceType.FRONTMATTER) {
		switch (propertyType) {
			case ObsidianPropertyType.TEXT:
				return "text";
			case ObsidianPropertyType.ALIASES:
				return "corner-up-right";
			case ObsidianPropertyType.TAGS:
				return "tags";
			case ObsidianPropertyType.MULTITEXT:
				return "list";
			case ObsidianPropertyType.DATE:
				return "calendar";
			case ObsidianPropertyType.DATETIME:
				return "clock";
			case ObsidianPropertyType.CHECKBOX:
				return "check-square";
			case ObsidianPropertyType.NUMBER:
				return "hash";
			default:
				throw new Error("Property type not handled");
		}
	}
	return "";
};

export const getIconIdForCellType = (type: CellType) => {
	switch (type) {
		case CellType.TEXT:
			return "text";
		case CellType.EMBED:
			return "link";
		case CellType.SOURCE_FILE:
		case CellType.FILE:
			return "file";
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
		case CellType.SOURCE:
			return "rss";
		default:
			return "text";
	}
};
