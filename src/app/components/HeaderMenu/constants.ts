import { CELL_TYPE, ICON } from "../../constants";
interface MenuItem {
	name: string;
	content: string;
	type: string;
}

export const MENU_ITEMS: MenuItem[] = [
	{ name: "text", content: "Text", type: CELL_TYPE.TEXT },
	{ name: "number", content: "Number", type: CELL_TYPE.NUMBER },
	{ name: "tag", content: "Tag", type: CELL_TYPE.TAG },
	// {
	// 	name: "multi-tag",
	// 	content: "Multi-Tag",
	// 	type: CELL_TYPE.MULTI_TAG,
	// },
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
