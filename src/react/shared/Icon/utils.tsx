import {
	ArrowUpward,
	ArrowDownward,
	MoreVert,
	MoreHoriz,
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
	Close,
	List,
	Numbers,
	CalendarTodayOutlined,
	LabelOutlined,
	CheckBoxOutlined,
	EditOutlined,
	TextSnippetOutlined,
	MoveUpOutlined,
	Search,
	MoveDownOutlined,
	ScheduleOutlined,
	Notes,
	PaymentsOutlined,
	Tune,
	DeleteOutline,
	Add,
	DragIndicator,
	ViewColumnOutlined,
} from "@mui/icons-material";
import { IconType } from "./types";
import { CellType } from "src/data/types";

export const findIcon = (
	type: IconType,
	className: string
): React.ReactNode => {
	switch (type) {
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
			return <DeleteOutline className={className} />;
		case IconType.MORE_VERT:
			return <MoreVert className={className} />;
		case IconType.SORT:
			return <Sort className={className} />;
		case IconType.KEYBOARD_BACKSPACE:
			return <KeyboardBackspace className={className} />;
		case IconType.MOVE_UP:
			return <MoveUpOutlined className={className} />;
		case IconType.MOVE_DOWN:
			return <MoveDownOutlined className={className} />;
		case IconType.TEXT_SNIPPET:
			return <TextSnippetOutlined className={className} />;
		case IconType.EDIT:
			return <EditOutlined className={className} />;
		case IconType.MORE_HORIZ:
			return <MoreHoriz className={className} />;
		case IconType.CLOSE:
			return <Close className={className} />;
		case IconType.NOTES:
			return <Notes className={className} />;
		case IconType.NUMBERS:
			return <Numbers className={className} />;
		case IconType.CHECK:
			return <CheckBoxOutlined className={className} />;
		case IconType.LABEL:
			return <LabelOutlined className={className} />;
		case IconType.CALENDAR_TODAY:
			return <CalendarTodayOutlined className={className} />;
		case IconType.SCHEDULE:
			return <ScheduleOutlined className={className} />;
		case IconType.SEARCH:
			return <Search className={className} />;
		case IconType.LIST:
			return <List className={className} />;
		case IconType.PAYMENTS:
			return <PaymentsOutlined className={className} />;
		case IconType.TUNE:
			return <Tune className={className} />;
		case IconType.ADD:
			return <Add className={className} />;
		case IconType.DRAG_INDICATOR:
			return <DragIndicator className={className} />;
		case IconType.VIEW_COLUMN:
			return <ViewColumnOutlined className={className} />;
		default:
			return "";
	}
};

export const getIconTypeFromCellType = (type: CellType) => {
	switch (type) {
		case CellType.TEXT:
			return IconType.NOTES;
		case CellType.NUMBER:
			return IconType.NUMBERS;
		case CellType.CHECKBOX:
			return IconType.CHECK;
		case CellType.CREATION_TIME:
		case CellType.LAST_EDITED_TIME:
			return IconType.SCHEDULE;
		case CellType.TAG:
			return IconType.LABEL;
		case CellType.MULTI_TAG:
			return IconType.LIST;
		case CellType.DATE:
			return IconType.SCHEDULE;
		case CellType.CURRENCY:
			return IconType.PAYMENTS;
		default:
			return IconType.NOTES;
	}
};
