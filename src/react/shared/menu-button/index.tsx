import React from "react";

import { css } from "@emotion/react";
import { Menu } from "src/shared/menu/types";
import MenuTrigger from "../menu-trigger";
import { buttonStyle, iconStyle, linkStyle } from "../button";

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
			fillParent={false}
			menu={menu}
			onClick={onClick}
			onMouseDown={onMouseDown}
		>
			<button
				className="NLT__menu-button"
				tabIndex={-1}
				css={css`
					${buttonStyle}
					${isLink ? linkStyle : undefined}
				    ${icon !== undefined ? iconStyle : undefined}
				`}
				aria-label={ariaLabel}
			>
				{icon !== undefined ? icon : children}
			</button>
		</MenuTrigger>
	);
}
