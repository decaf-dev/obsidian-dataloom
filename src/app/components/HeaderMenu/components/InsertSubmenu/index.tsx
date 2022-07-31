import React from "react";

import MenuItem from "../MenuItem";
import { Icon } from "src/app/services/icon/types";

interface Props {
	onInsertClick: (isRightInsert: boolean) => void;
}

export default function InsertSubmenu({ onInsertClick }: Props) {
	return (
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
	);
}
