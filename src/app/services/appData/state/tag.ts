export interface Tag {
	id: string;
	headerId: string;
	content: string;
	color: string;
	selected: string[];
}

export const initialTag = (
	headerId: string,
	cellId: string,
	content: string,
	color: string
): Tag => {
	return {
		id: uuidv4(),
		headerId,
		content,
		color,
		selected: [cellId],
	};
};
