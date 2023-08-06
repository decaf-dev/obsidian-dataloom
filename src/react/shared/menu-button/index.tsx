import React from "react";

import { LoomMenu } from "src/shared/menu/types";
import MenuTrigger from "../menu-trigger";
import Button from "../button";
import { ButtonVariant } from "../button/types";

interface MenuButtonProps {
	variant?: ButtonVariant;
	menu: LoomMenu;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick?: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

export default function MenuButton({
	variant,
	menu,
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
				variant={variant}
				icon={icon}
				ariaLabel={ariaLabel}
			>
				{children}
			</Button>
		</MenuTrigger>
	);
}
