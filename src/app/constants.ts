export const DEBUG = false;

export interface CellType {
	TEXT: string;
	NUMBER: string;
	TAG: string;
	MULTI_TAG: string;
	ERROR: string;
}

interface CellColor {
	YELLOW: string;
	RED: string;
	PINK: string;
	ORANGE: string;
	GRAY: string;
	PURPLE: string;
}

export const CELL_TYPE: CellType = {
	TEXT: "text",
	NUMBER: "number",
	TAG: "tag",
	MULTI_TAG: "multi-tag",
	ERROR: "error",
};

export const CELL_COLOR: CellColor = {
	YELLOW: "yellow",
	RED: "red",
	PINK: "pink",
	ORANGE: "orange",
	GRAY: "gray",
	PURPLE: "purple",
};
