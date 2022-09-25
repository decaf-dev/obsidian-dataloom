export enum MenuLevel {
	ONE,
	TWO,
	THREE,
}

export interface Menu {
	id: string;
	level: MenuLevel;
}
