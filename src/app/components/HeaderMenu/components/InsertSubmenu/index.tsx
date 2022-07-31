import React from "react";

import Submenu from "../Submenu";
import MenuItem from "../MenuItem";
import { Icon } from "src/app/services/icon/types";

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
					icon={Icon.KEYBOARD_DOUBLE_ARROW_LEFT}
					content="Insert Left"
					onClick={() => onInsertClick(false)}
				/>
				<MenuItem
					icon={Icon.KEYBOARD_DOUBLE_ARROW_RIGHT}
					content="Insert Right"
					onClick={() => onInsertClick(true)}
				/>
			</ul>
		</Submenu>
	);
}
