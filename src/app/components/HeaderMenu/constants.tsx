import React from "react";

import { CELL_TYPE } from "../../constants";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import Sort from "@mui/icons-material/Sort";

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
	icon: React.ReactNode;
}

export const SORT: { [name: string]: SortItem } = {
	DEFAULT: { name: "default", content: "Default", icon: <Sort /> },
	ASC: { name: "asc", content: "Ascending", icon: <KeyboardArrowUp /> },
	DESC: { name: "desc", content: "Descending", icon: <KeyboardArrowDown /> },
};
