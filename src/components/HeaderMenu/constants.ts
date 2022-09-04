import { CONTENT_TYPE } from "../../constants";

import { Icon } from "src/services/icon/types";
import { SortDir } from "src/services/sort/types";
export interface SubmenuItem {
	name: string;
	content: string;
	icon: Icon;
}

export const SUBMENU_ITEM: { [name: string]: SubmenuItem } = {
	EDIT: {
		name: "edit",
		content: "Edit",
		icon: Icon.EDIT,
	},
	SORT: {
		name: "sort",
		content: "Sort",
		icon: Icon.SORT,
	},
	MOVE: {
		name: "move",
		content: "Move",
		icon: Icon.MOVE_UP,
	},
	INSERT: {
		name: "insert",
		content: "Insert",
		icon: Icon.KEYBOARD_DOUBLE_ARROW_RIGHT,
	},
	TYPE: {
		name: "type",
		content: "Type",
		icon: Icon.TEXT_SNIPPET,
	},
};

export interface MenuItem {
	name: string;
	content: string;
	type: string;
}

export const TYPE_ITEMS: MenuItem[] = [
	{ name: "text", content: "Text", type: CONTENT_TYPE.TEXT },
	{ name: "number", content: "Number", type: CONTENT_TYPE.NUMBER },
	{ name: "tag", content: "Tag", type: CONTENT_TYPE.TAG },
	{ name: "date", content: "Date", type: CONTENT_TYPE.DATE },
	{ name: "checkbox", content: "Checkbox", type: CONTENT_TYPE.CHECKBOX },
];
interface SortMenuItem {
	[name: string]: {
		name: SortDir;
		content: string;
		icon: Icon;
	};
}

export const SORT_MENU_ITEM: SortMenuItem = {
	ASC: {
		name: SortDir.ASC,
		content: "Ascending",
		icon: Icon.ARROW_UPWARD,
	},
	DESC: {
		name: SortDir.DESC,
		content: "Descending",
		icon: Icon.ARROW_DOWNWARD,
	},
	DEFAULT: {
		name: SortDir.DEFAULT,
		content: "Default",
		icon: Icon.HEIGHT,
	},
};
