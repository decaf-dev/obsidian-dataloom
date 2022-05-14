export const DEBUG = {
	LOAD_APP_DATA: {
		LOG_MESSAGE: true,
		IDS: true,
		TYPES: true,
	},
	SAVE_APP_DATA: {
		LOG_MESSAGE: true,
		APP_DATA: true,
		TABLE_REGEX: false,
		UPDATED_CONTENT: false,
	},
};
export const DEBUG_TYPES = true;

export interface CellType {
	TEXT: string;
	NUMBER: string;
	TAG: string;
	DATE: string;
	CHECKBOX: string;
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

export interface TabbableElementType {
	UNFOCUSED: string;
	BUTTON: string;
	HEADER: string;
	CELL: string;
}

export const TABBABLE_ELEMENT_TYPE: TabbableElementType = {
	UNFOCUSED: "unfocused",
	BUTTON: "button",
	HEADER: "header",
	CELL: "cell",
};

export const CELL_TYPE: CellType = {
	TEXT: "text",
	NUMBER: "number",
	TAG: "tag",
	DATE: "date",
	CHECKBOX: "checkbox",
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
	KEYBOARD_BACKSPACE: "KeyboardBackspace",
	DELETE: "Delete",
	MORE_VERT: "MoreVert",
	SORT: "Sort",
	MOVE_UP: "MoveUp",
	MOVE_DOWN: "MoveDown",
	TEXT_SNIPPET: "TextSnippet",
	EDIT: "Edit",
};
