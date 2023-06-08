import React from "react";

import { Menu } from "src/shared/menu/types";
import MenuTrigger from "../menu-trigger";
import Button from "../button";

interface MenuButtonProps {
	menu: Menu;
	isLink?: boolean;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick?: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

export default function MenuButton({
	menu,
	isLink = false,
	ariaLabel,
	icon,
	children,
	onClick,
	onMouseDown,
}: MenuButtonProps) {
	return (
		<MenuTrigger
			isButton
			menu={menu}
			onClick={onClick}
			onMouseDown={onMouseDown}
		>
			<Button
				isFocusable={false}
				isLink={isLink}
				icon={icon}
				ariaLabel={ariaLabel}
			>
				{children}
			</Button>
		</MenuTrigger>
	);
}
