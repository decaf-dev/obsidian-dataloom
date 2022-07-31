import React from "react";

import MenuItem from "../MenuItem";
import { Icon } from "src/app/services/icon/types";

interface Props {
	headerIndex: number;
	numHeaders: number;
	onMoveClick: (isRightMove: boolean) => void;
}
export default function MoveSubmenu({
	headerIndex,
	numHeaders,
	onMoveClick,
}: Props) {
	return (
		<ul className="NLT__header-menu-ul">
			{headerIndex !== 0 && (
				<MenuItem
					icon={Icon.KEYBOARD_DOUBLE_ARROW_LEFT}
					content="Move Left"
					onClick={() => onMoveClick(false)}
				/>
			)}
			{headerIndex !== numHeaders - 1 && (
				<MenuItem
					icon={Icon.KEYBOARD_DOUBLE_ARROW_RIGHT}
					content="Move Right"
					onClick={() => onMoveClick(true)}
				/>
			)}
		</ul>
	);
}
