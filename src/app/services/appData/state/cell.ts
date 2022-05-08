export interface Cell {
	id: string;
	rowId: string;
	headerId: string;
	content: string;
	type: string;
	expectedType: string | null;
}

export const initialCell = (
	id: string,
	rowId: string,
	headerId: string,
	type: string,
	content: string,
	expectedType: string | null = null
): Cell => {
	return {
		id,
		rowId,
		headerId,
		type,
		content,
		expectedType,
	};
};
