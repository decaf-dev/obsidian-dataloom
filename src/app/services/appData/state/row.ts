export interface Row {
	id: string;
	creationTime: number;
}

export const initialRow = (id: string, creationTime: number): Row => {
	return {
		id,
		creationTime,
	};
};
