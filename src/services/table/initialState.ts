import { Cell, Header, Row } from "./types";

export const initialHeader = (
	id: string,
	content: string,
	textContent: string
): Header => {
	return {
		id,
		content,
		textContent,
	};
};

export const initialRow = (id: string): Row => {
	return {
		id,
	};
};

export const initialCell = (
	id: string,
	headerId: string,
	rowId: string,
	content: string,
	textContent: string
): Cell => {
	return {
		id,
		headerId,
		rowId,
		content,
		textContent,
	};
};
