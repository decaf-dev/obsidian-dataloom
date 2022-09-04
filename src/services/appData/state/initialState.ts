import { CONTENT_TYPE } from "../../../constants";
import { SortDir } from "../../sort/types";

import { Header, Row } from "./types";

export const initialHeader = (id: string, content: string): Header => {
	return {
		id,
		content,
		sortDir: SortDir.DEFAULT,
		width: "100px",
		shouldWrapOverflow: true,
		useAutoWidth: false,
		type: CONTENT_TYPE.TEXT,
	};
};

export const initialRow = (
	id: string,
	initialIndex: number,
	creationTime: number
): Row => {
	return {
		id,
		initialIndex,
		creationTime,
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
