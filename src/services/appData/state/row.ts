export interface Row {
	id: string;
	initialIndex: number;
	creationTime: number;
}

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
