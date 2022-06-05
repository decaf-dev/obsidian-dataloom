export interface Tag {
	id: string;
	headerId: string;
	content: string;
	color: string;
	selected: string[];
}

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
