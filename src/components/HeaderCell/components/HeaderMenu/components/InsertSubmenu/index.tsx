import Submenu from "../Submenu";
import MenuItem from "src/components/MenuItem";
import { IconType } from "src/services/icon/types";

interface Props {
	title: string;
	onInsertClick: (isRightInsert: boolean) => void;
	onBackClick: () => void;
}

export default function InsertSubmenu({
	title,
	onInsertClick,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<MenuItem
				iconType={IconType.KEYBOARD_DOUBLE_ARROW_LEFT}
				name="Insert Left"
				onClick={() => onInsertClick(false)}
			/>
			<MenuItem
				iconType={IconType.KEYBOARD_DOUBLE_ARROW_RIGHT}
				name="Insert Right"
				onClick={() => onInsertClick(true)}
			/>
		</Submenu>
	);
}
