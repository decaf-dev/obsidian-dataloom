import { CellType } from "src/shared/loom-state/types/loom-state";
import { FrontMatterType } from "src/shared/deserialize-frontmatter/types";

export const cellTypeToFrontMatterKeyTypes = (
	type: CellType
): FrontMatterType[] => {
	switch (type) {
		case CellType.TEXT:
		case CellType.EMBED:
		case CellType.FILE:
		case CellType.TAG:
			return ["text"];
		case CellType.NUMBER:
		case CellType.DATE:
			// return ["number", "date"]; //TODO support date
			return ["number"];
		case CellType.CHECKBOX:
			return ["boolean"];
		case CellType.MULTI_TAG:
			return ["tags", "list"];
		case CellType.CREATION_TIME:
		case CellType.LAST_EDITED_TIME:
		case CellType.SOURCE:
		case CellType.SOURCE_FILE:
			return [];
		default:
			throw new Error("Cell type not handled");
	}
};
