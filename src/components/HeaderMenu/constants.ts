import { CellType } from "src/services/table/types";

import { IconType } from "src/services/icon/types";
import { SortDir } from "src/services/sort/types";
export interface SubmenuItem {
	name: string;
	content: string;
	icon: IconType;
}

export const SUBMENU_ITEM: { [name: string]: SubmenuItem } = {
	EDIT: {
		name: "edit",
		content: "Edit",
		icon: IconType.EDIT,
	},
	SORT: {
		name: "sort",
		content: "Sort",
		icon: IconType.SORT,
	},
	MOVE: {
		name: "move",
		content: "Move",
		icon: IconType.MOVE_UP,
	},
	INSERT: {
		name: "insert",
		content: "Insert",
		icon: IconType.KEYBOARD_DOUBLE_ARROW_RIGHT,
	},
	TYPE: {
		name: "type",
		content: "Type",
		icon: IconType.TEXT_SNIPPET,
	},
};

export interface MenuItem {
	name: string;
	content: string;
	type: CellType;
}

export const TYPE_ITEMS: MenuItem[] = [
	{ name: "text", content: "Text", type: CellType.TEXT },
	{ name: "number", content: "Number", type: CellType.NUMBER },
	{ name: "tag", content: "Tag", type: CellType.TAG },
	{ name: "multi-tag", content: "Multi-Tag", type: CellType.MULTI_TAG },
	{ name: "date", content: "Date", type: CellType.DATE },
	{ name: "checkbox", content: "Checkbox", type: CellType.CHECKBOX },
];
interface SortMenuItem {
	[name: string]: {
		name: SortDir;
		content: string;
		icon: IconType | null;
	};
}

export const SORT_MENU_ITEM: SortMenuItem = {
	ASC: {
		name: SortDir.ASC,
		content: "Ascending",
		icon: IconType.ARROW_UPWARD,
	},
	DESC: {
		name: SortDir.DESC,
		content: "Descending",
		icon: IconType.ARROW_DOWNWARD,
	},
};
