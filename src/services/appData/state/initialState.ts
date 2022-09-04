import { CellType } from "src/services/appData/state/types";
import { SortDir } from "../../sort/types";

import {
	AMPERSAND_CHARACTER_REGEX,
	LINE_BREAK_CHARACTER_REGEX,
} from "../../string/regex";

import {
	parseBoldTags,
	parseHighlightTags,
	parseItalicTags,
	parseUnderlineTags,
} from "../../string/parsers";

import { AMPERSAND, BREAK_LINE_TAG } from "src/constants";

import { Cell, Header, Row, Tag } from "./types";

export const initialHeader = (id: string, content: string): Header => {
	return {
		id,
		content,
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
	content: string
): Cell => {
	//TODO refactor
	content = content.replace(LINE_BREAK_CHARACTER_REGEX("g"), BREAK_LINE_TAG);
	content = content.replace(AMPERSAND_CHARACTER_REGEX("g"), AMPERSAND);

	content = parseBoldTags(content);
	content = parseItalicTags(content);
	content = parseHighlightTags(content);
	content = parseUnderlineTags(content);
	return {
		id,
		headerId,
		rowId,
		type,
		content,
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
