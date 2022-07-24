export const DEBUG = {
	LOAD_APP_DATA: {
		PARSED_TABLE: false,
		DATA: false,
		IDS: false,
		TYPES: false,
		MARKDOWN: false,
	},
	APP: false,
	SAVE_APP_DATA: false,
	EDITABLE_TD: false,
	FOCUS_PROVIDER: false,
	MENU_PROVIDER: false,
};

export interface CellType {
	TEXT: string;
	NUMBER: string;
	TAG: string;
	DATE: string;
	CHECKBOX: string;
	MULTI_TAG: string;
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

export const CONTENT_TYPE: CellType = {
	TEXT: "text",
	NUMBER: "number",
	TAG: "tag",
	DATE: "date",
	CHECKBOX: "checkbox",
	MULTI_TAG: "multi-tag",
};

export const COLOR: { [color: string]: string } = {
	LIGHT_GRAY: "light gray",
	GRAY: "gray",
	BROWN: "brown",
	ORANGE: "orange",
	YELLOW: "yellow",
	GREEN: "green",
	BLUE: "blue",
	PURPLE: "purple",
	PINK: "pink",
	RED: "red",
};

export const MENU_LEVEL = {
	ONE: 1,
	TWO: 2,
	THREE: 3,
};

export const BREAK_LINE_TAG = "<br>";
export const AMPERSAND = "&";
export const BOLD_TAG_MARKDOWN = "**";
export const ITALIC_TAG_MARKDOWN = "*";
export const HIGHLIGHT_TAG_MARKDOWN = "==";
export const UNDERLINE_TAG_START = "<u>";
export const UNDERLINE_TAG_CLOSE = "</u>";
export const ITALIC_TAG_START = "<i>";
export const ITALIC_TAG_CLOSE = "</i>";
export const BOLD_TAG_START = "<b>";
export const BOLD_TAG_CLOSE = "</b>";
export const HIGHLIGHT_TAG_START = "<mark>";
export const HIGHLIGHT_TAG_CLOSE = "</mark>";

export const MIN_COLUMN_WIDTH_PX = 50;

export const CURRENT_TABLE_CACHE_VERSION = 421;
