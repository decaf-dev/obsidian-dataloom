import { Icon } from "src/app/services/icon/types";

interface RowMenuItem {
	name: string;
	content: string;
	icon: Icon;
	rule?: string;
}

interface RowMenuObject {
	[name: string]: RowMenuItem;
}

export const DRAG_MENU_ITEM: RowMenuObject = {
	MOVE_UP: {
		name: "move-up",
		content: "Move Up",
		icon: Icon.MOVE_UP,
		rule: "first",
	},
	MOVE_DOWN: {
		name: "move-down",
		content: "Move Down",
		icon: Icon.MOVE_DOWN,
		rule: "last",
	},
	INSERT_ABOVE: {
		name: "insert-above",
		content: "Insert Above",
		icon: Icon.KEYBOARD_DOUBLE_ARROW_UP,
	},
	INSERT_BELOW: {
		name: "insert-below",
		content: "Insert Below",
		icon: Icon.KEYBOARD_DOUBLE_ARROW_DOWN,
	},
	DELETE: {
		name: "delete",
		content: "Delete",
		icon: Icon.DELETE,
	},
};
