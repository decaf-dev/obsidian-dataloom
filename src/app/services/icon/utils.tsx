import React from "react";

import {
	ArrowUpward,
	ArrowDownward,
	HorizontalRule,
	MoreVert,
	MoreHoriz,
	Delete,
	Sort,
	KeyboardArrowDown,
	KeyboardArrowUp,
	KeyboardDoubleArrowDown,
	KeyboardDoubleArrowUp,
	KeyboardArrowLeft,
	KeyboardArrowRight,
	KeyboardDoubleArrowLeft,
	KeyboardDoubleArrowRight,
	KeyboardBackspace,
	MoveUp,
	MoveDown,
	TextSnippet,
	Edit,
} from "@mui/icons-material";

import { Icon } from "./types";
import { SortDir } from "../sort/types";

export const findSortIcon = (
	sortDir: SortDir,
	className: string
): React.ReactNode => {
	switch (sortDir) {
		case "asc":
			return findIcon(Icon.ARROW_UPWARD, className);
		case "desc":
			return findIcon(Icon.ARROW_DOWNWARD, className);
		default:
			return findIcon(Icon.HORIZONTAL_RULE, className);
	}
};

export const findIcon = (icon: Icon, className: string): React.ReactNode => {
	switch (icon) {
		case Icon.ARROW_UPWARD:
			return <ArrowUpward className={className} />;
		case Icon.ARROW_DOWNWARD:
			return <ArrowDownward className={className} />;
		case Icon.HORIZONTAL_RULE:
			return <HorizontalRule className={className} />;
		case Icon.KEYBOARD_ARROW_UP:
			return <KeyboardArrowUp className={className} />;
		case Icon.KEYBOARD_ARROW_DOWN:
			return <KeyboardArrowDown className={className} />;
		case Icon.KEYBOARD_DOUBLE_ARROW_UP:
			return <KeyboardDoubleArrowUp className={className} />;
		case Icon.KEYBOARD_DOUBLE_ARROW_DOWN:
			return <KeyboardDoubleArrowDown className={className} />;
		case Icon.KEYBOARD_ARROW_LEFT:
			return <KeyboardArrowLeft className={className} />;
		case Icon.KEYBOARD_ARROW_RIGHT:
			return <KeyboardArrowRight className={className} />;
		case Icon.KEYBOARD_DOUBLE_ARROW_LEFT:
			return <KeyboardDoubleArrowLeft className={className} />;
		case Icon.KEYBOARD_DOUBLE_ARROW_RIGHT:
			return <KeyboardDoubleArrowRight className={className} />;
		case Icon.DELETE:
			return <Delete className={className} />;
		case Icon.MORE_VERT:
			return <MoreVert className={className} />;
		case Icon.SORT:
			return <Sort className={className} />;
		case Icon.KEYBOARD_BACKSPACE:
			return <KeyboardBackspace className={className} />;
		case Icon.MOVE_UP:
			return <MoveUp className={className} />;
		case Icon.MOVE_DOWN:
			return <MoveDown className={className} />;
		case Icon.TEXT_SNIPPET:
			return <TextSnippet className={className} />;
		case Icon.EDIT:
			return <Edit className={className} />;
		case Icon.MORE_HORIZ:
			return <MoreHoriz className={className} />;
		default:
			return "";
	}
};
