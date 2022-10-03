import Submenu from "../Submenu";
import MenuItem from "../MenuItem";
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
			<ul className="NLT__header-menu-ul">
				<MenuItem
					icon={IconType.KEYBOARD_DOUBLE_ARROW_LEFT}
					content="Insert Left"
					onClick={() => onInsertClick(false)}
				/>
				<MenuItem
					icon={IconType.KEYBOARD_DOUBLE_ARROW_RIGHT}
					content="Insert Right"
					onClick={() => onInsertClick(true)}
				/>
			</ul>
		</Submenu>
	);
}
