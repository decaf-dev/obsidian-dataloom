export const DEBUG = false;

interface CellType {
	TEXT: string;
	NUMBER: string;
	TAG: string;
	MULTI_TAG: string;
	ERROR: string;
}

interface Arrow {
	UP: string;
	DOWN: string;
	NONE: string;
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

export const ARROW: Arrow = {
	UP: "up",
	DOWN: "down",
	NONE: "none",
};

export const CELL_COLOR: CellColor = {
	YELLOW: "yellow",
	RED: "red",
	PINK: "pink",
	ORANGE: "orange",
	GRAY: "gray",
	PURPLE: "purple",
};
