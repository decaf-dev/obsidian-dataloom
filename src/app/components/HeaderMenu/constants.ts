import { CONTENT_TYPE, ICON } from "../../constants";
interface MenuItem {
	name: string;
	content: string;
	type: string;
}

export const SUBMENU = {
	EDIT: {
		name: "edit",
		content: "Edit",
		icon: ICON.EDIT,
	},
	SORT: {
		name: "sort",
		content: "Sort",
		icon: ICON.SORT,
	},
	MOVE: {
		name: "move",
		content: "Move",
		icon: ICON.MOVE_UP,
	},
	INSERT: {
		name: "insert",
		content: "Insert",
		icon: ICON.KEYBOARD_DOUBLE_ARROW_RIGHT,
	},
	TYPE: {
		name: "type",
		content: "Type",
		icon: ICON.TEXT_SNIPPET,
	},
};

export const TYPE_ITEMS: MenuItem[] = [
	{ name: "text", content: "Text", type: CONTENT_TYPE.TEXT },
	{ name: "number", content: "Number", type: CONTENT_TYPE.NUMBER },
	{ name: "tag", content: "Tag", type: CONTENT_TYPE.TAG },
	{ name: "date", content: "Date", type: CONTENT_TYPE.DATE },
	{ name: "checkbox", content: "Checkbox", type: CONTENT_TYPE.CHECKBOX },
];

interface SortItem {
	name: string;
	content: string;
	icon: string;
}

export const SORT: { [name: string]: SortItem } = {
	DEFAULT: {
		name: "default",
		content: "Default",
		icon: ICON.SORT,
	},
	ASC: {
		name: "asc",
		content: "Ascending",
		icon: ICON.KEYBOARD_ARROW_UP,
	},
	DESC: {
		name: "desc",
		content: "Descending",
		icon: ICON.KEYBOARD_ARROW_DOWN,
	},
};
