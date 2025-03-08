import type { Cell } from "./types";
import { CellType } from "./types";
import { generateUuid } from "./utils";

export const createCellForType = (columnId: string, type: CellType): Cell => {
	switch (type) {
		case CellType.TEXT:
			return createTextCell(columnId);
	}
};

export const createTextCell = (
	columnId: string,
	options?: {
		content?: string;
	}
): Cell => {
	const { content = "" } = options ?? {};
	return {
		id: generateUuid(),
		columnId,
		content,
	};
};
