import { CellType, SortDir } from "src/services/tableState/types";

import { IconType } from "src/services/icon/types";
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
		icon: IconType.NOTES,
	},
};

export interface MenuItem {
	name: string;
	content: string;
	type: CellType;
}

interface SortMenuItem {
	[name: string]: {
		name: SortDir;
		content: string;
		icon: IconType;
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
