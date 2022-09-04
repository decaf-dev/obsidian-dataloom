import React from "react";

import MenuItem from "../MenuItem";
import { Icon } from "src/services/icon/types";
import Submenu from "../Submenu";

interface Props {
	title: string;
	headerIndex: number;
	numHeaders: number;
	onMoveClick: (isRightMove: boolean) => void;
	onBackClick: () => void;
}
export default function MoveSubmenu({
	title,
	headerIndex,
	numHeaders,
	onMoveClick,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
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
		</Submenu>
	);
}
