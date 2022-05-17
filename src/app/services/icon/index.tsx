import React from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import SortIcon from "@mui/icons-material/Sort";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import EditIcon from "@mui/icons-material/Edit";
import { MoreHoriz } from "@mui/icons-material";

import { ICON } from "../../constants";

export const findIcon = (icon: string, className: string): React.ReactNode => {
	switch (icon) {
		case ICON.KEYBOARD_ARROW_UP:
			return <KeyboardArrowUpIcon className={className} />;
		case ICON.KEYBOARD_ARROW_DOWN:
			return <KeyboardArrowDownIcon className={className} />;
		case ICON.KEYBOARD_DOUBLE_ARROW_UP:
			return <KeyboardDoubleArrowUpIcon className={className} />;
		case ICON.KEYBOARD_DOUBLE_ARROW_DOWN:
			return <KeyboardDoubleArrowDownIcon className={className} />;
		case ICON.KEYBOARD_ARROW_LEFT:
			return <KeyboardArrowLeftIcon className={className} />;
		case ICON.KEYBOARD_ARROW_RIGHT:
			return <KeyboardArrowRightIcon className={className} />;
		case ICON.KEYBOARD_DOUBLE_ARROW_LEFT:
			return <KeyboardDoubleArrowLeftIcon className={className} />;
		case ICON.KEYBOARD_DOUBLE_ARROW_RIGHT:
			return <KeyboardDoubleArrowRightIcon className={className} />;
		case ICON.DELETE:
			return <DeleteIcon className={className} />;
		case ICON.MORE_VERT:
			return <MoreVertIcon className={className} />;
		case ICON.SORT:
			return <SortIcon className={className} />;
		case ICON.KEYBOARD_BACKSPACE:
			return <KeyboardBackspaceIcon className={className} />;
		case ICON.MOVE_UP:
			return <MoveUpIcon className={className} />;
		case ICON.MOVE_DOWN:
			return <MoveDownIcon className={className} />;
		case ICON.TEXT_SNIPPET:
			return <TextSnippetIcon className={className} />;
		case ICON.EDIT:
			return <EditIcon className={className} />;
		case ICON.MORE_HORIZ:
			return <MoreHoriz className={className} />;
		default:
			return "";
	}
};
