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

export const ICON = {
	KEYBOARD_ARROW_UP: "KeyboardArrowUp",
	KEYBOARD_ARROW_DOWN: "KeyboardArrowDown",
	KEYBOARD_DOUBLE_ARROW_UP: "KeyboardDoubleArrowUp",
	KEYBOARD_DOUBLE_ARROW_DOWN: "KeyboardDoubleArrowDown",
	KEYBOARD_ARROW_LEFT: "KeyboardArrowLeft",
	KEYBOARD_ARROW_RIGHT: "KeyboardArrowRight",
	KEYBOARD_DOUBLE_ARROW_LEFT: "KeyboardDoubleArrowLeft",
	KEYBOARD_DOUBLE_ARROW_RIGHT: "KeyboardDoubleArrowRight",
	DELETE: "Delete",
	MORE_VERT: "MoreVert",
	SORT: "Sort",
};
