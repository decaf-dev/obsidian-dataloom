export enum MenuLevel {
	ONE,
	TWO,
	THREE,
}

export interface MenuPosition {
	top: number;
	left: number;
	width: number;
	height: number;
}

export interface Menu {
	id: string;
	level: MenuLevel;
}

export interface RenderableMenu extends Menu {
	sortRowsOnClose: boolean;
	position: MenuPosition;
	containerRef: React.MutableRefObject<any | null>;
}
