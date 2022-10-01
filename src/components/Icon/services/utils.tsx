import {
	ArrowUpward,
	ArrowDownward,
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
	Close,
} from "@mui/icons-material";

import { IconType } from "src/services/icon/types";

export const findIcon = (
	icon: IconType,
	className: string
): React.ReactNode => {
	switch (icon) {
		case IconType.ARROW_UPWARD:
			return <ArrowUpward className={className} />;
		case IconType.ARROW_DOWNWARD:
			return <ArrowDownward className={className} />;
		case IconType.KEYBOARD_ARROW_UP:
			return <KeyboardArrowUp className={className} />;
		case IconType.KEYBOARD_ARROW_DOWN:
			return <KeyboardArrowDown className={className} />;
		case IconType.KEYBOARD_DOUBLE_ARROW_UP:
			return <KeyboardDoubleArrowUp className={className} />;
		case IconType.KEYBOARD_DOUBLE_ARROW_DOWN:
			return <KeyboardDoubleArrowDown className={className} />;
		case IconType.KEYBOARD_ARROW_LEFT:
			return <KeyboardArrowLeft className={className} />;
		case IconType.KEYBOARD_ARROW_RIGHT:
			return <KeyboardArrowRight className={className} />;
		case IconType.KEYBOARD_DOUBLE_ARROW_LEFT:
			return <KeyboardDoubleArrowLeft className={className} />;
		case IconType.KEYBOARD_DOUBLE_ARROW_RIGHT:
			return <KeyboardDoubleArrowRight className={className} />;
		case IconType.DELETE:
			return <Delete className={className} />;
		case IconType.MORE_VERT:
			return <MoreVert className={className} />;
		case IconType.SORT:
			return <Sort className={className} />;
		case IconType.KEYBOARD_BACKSPACE:
			return <KeyboardBackspace className={className} />;
		case IconType.MOVE_UP:
			return <MoveUp className={className} />;
		case IconType.MOVE_DOWN:
			return <MoveDown className={className} />;
		case IconType.TEXT_SNIPPET:
			return <TextSnippet className={className} />;
		case IconType.EDIT:
			return <Edit className={className} />;
		case IconType.MORE_HORIZ:
			return <MoreHoriz className={className} />;
		case IconType.CLOSE:
			return <Close className={className} />;
		default:
			return "";
	}
};
