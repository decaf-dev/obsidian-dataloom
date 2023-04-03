import MenuItem from "../../../MenuItem";
import { IconType } from "src/services/icon/types";
import Submenu from "../Submenu";

interface Props {
	title: string;
	columnIndex: number;
	numColumns: number;
	onMoveClick: (isRightMove: boolean) => void;
	onBackClick: () => void;
}
export default function MoveSubmenu({
	title,
	columnIndex,
	numColumns,
	onMoveClick,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			{columnIndex !== 0 && (
				<MenuItem
					iconType={IconType.KEYBOARD_DOUBLE_ARROW_LEFT}
					name="Move Left"
					onClick={() => onMoveClick(false)}
				/>
			)}
			{columnIndex !== numColumns - 1 && (
				<MenuItem
					iconType={IconType.KEYBOARD_DOUBLE_ARROW_RIGHT}
					name="Move Right"
					onClick={() => onMoveClick(true)}
				/>
			)}
		</Submenu>
	);
}
