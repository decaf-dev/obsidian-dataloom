import { CellType, SourceType } from "src/shared/loom-state/types/loom-state";

export const getIconIdForSourceType = (type: SourceType) => {
	switch (type) {
		case SourceType.FOLDER:
			return "folder";
		case SourceType.FRONTMATTER:
			return "file-key-2";
		default:
			return "";
	}
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
