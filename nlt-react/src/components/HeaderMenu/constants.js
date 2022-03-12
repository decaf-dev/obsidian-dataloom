import { CELL_TYPE } from "../../constants";

export const MENU_ACTION = {
	ITEM_CLICK: "item-click",
	DELETE: "delete",
	OUTSIDE_CLICK: "outside-click",
};

export const MENU_ITEMS = [
	{ name: "text", content: "Text", type: CELL_TYPE.TEXT },
	{ name: "number", content: "Number", type: CELL_TYPE.NUMBER },
	{ name: "tag", content: "Tag", type: CELL_TYPE.TAG },
	{
		name: "multi-tag",
		content: "Multi-Tag",
		type: CELL_TYPE.MULTI_TAG,
	},
];
