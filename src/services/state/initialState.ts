import { CellType } from "src/services/table/types";
import { SortDir } from "../sort/types";

import { Cell, Header, Row, Tag } from "../table/types";

export const initialHeader = (
	id: string,
	content: string,
	textContent: string
): Header => {
	return {
		id,
		content,
		textContent,
		sortDir: SortDir.NONE,
		width: "100px",
		shouldWrapOverflow: true,
		useAutoWidth: false,
		type: CellType.TEXT,
	};
};

export const initialRow = (id: string, creationTime: number): Row => {
	return {
		id,
		creationTime,
	};
};

export const initialCell = (
	id: string,
	headerId: string,
	rowId: string,
	type: CellType,
	content: string,
	textContent: string
): Cell => {
	return {
		id,
		headerId,
		rowId,
		type,
		content,
		textContent,
	};
};

export const initialTag = (
	id: string,
	headerId: string,
	cellId: string,
	content: string,
	color: string
): Tag => {
	return {
		id,
		headerId,
		content,
		color,
		selected: [cellId],
	};
};
