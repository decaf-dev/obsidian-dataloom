import React from "react";

import IconButton from "src/components/IconButton";
import { Icon } from "src/services/icon/types";

import "./styles.css";

interface Props {
	title: string;
	children: React.ReactNode;
	onBackClick: () => void;
}

export default function Submenu({ title, children, onBackClick }: Props) {
	return (
		<>
			<div className="NLT__submenu-header">
				<IconButton
					icon={Icon.KEYBOARD_BACKSPACE}
					onClick={() => onBackClick()}
				/>
				<div className="NLT__header-menu-title">{title}</div>
			</div>
			<hr className="NLT__hr" />
			<div className="NLT__submenu-body">{children}</div>
		</>
	);
}
