import { ICON } from "src/app/constants";

interface DragMenuItem {
	name: string;
	content: string;
	icon: string;
	rule?: string;
}

interface DragMenuObject {
	[name: string]: DragMenuItem;
}

export const DRAG_MENU_ITEM: DragMenuObject = {
	MOVE_UP: {
		name: "move-up",
		content: "Move Up",
		icon: ICON.MOVE_UP,
		rule: "first",
	},
	MOVE_DOWN: {
		name: "move-down",
		content: "Move Down",
		icon: ICON.MOVE_DOWN,
		rule: "last",
	},
	INSERT_ABOVE: {
		name: "insert-above",
		content: "Insert Above",
		icon: ICON.KEYBOARD_DOUBLE_ARROW_UP,
	},
	INSERT_BELOW: {
		name: "insert-below",
		content: "Insert Below",
		icon: ICON.KEYBOARD_DOUBLE_ARROW_DOWN,
	},
	DELETE: {
		name: "delete",
		content: "Delete",
		icon: ICON.DELETE,
	},
};
