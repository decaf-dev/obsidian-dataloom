import React from "react";

import { css } from "@emotion/react";
import "./styles.css";
import { Menu } from "src/shared/menu/types";
import { getButtonClassName } from "./utils";
import MenuTrigger from "../menu-trigger";

interface ButtonProps {
	isLink?: boolean;
	isSimple?: boolean;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

export const Button = ({
	isLink,
	children,
	ariaLabel = "",
	icon,
	isSimple,
	onClick,
	onMouseDown,
}: ButtonProps) => {
	const className = getButtonClassName({
		isLink,
		isSimple,
		hasIcon: icon !== undefined,
	});

	return (
		<button
			className={className}
			css={css`
				width: max-content !important;
			`}
			aria-label={ariaLabel}
			onMouseDown={onMouseDown}
			onClick={onClick}
		>
			{icon !== undefined ? icon : children}
		</button>
	);
};

interface MenuButtonProps {
	menu: Menu;
	isLink?: boolean;
	isSimple?: boolean;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick?: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

export const MenuButton = ({
	menu,
	isLink = false,
	isSimple,
	ariaLabel,
	icon,
	children,
	onClick,
	onMouseDown,
}: MenuButtonProps) => {
	const className = getButtonClassName({
		isLink,
		isSimple,
		hasIcon: icon !== undefined,
	});

	return (
		<MenuTrigger
			fillParent={false}
			menu={menu}
			onClick={onClick}
			onMouseDown={onMouseDown}
		>
			<button
				className={className}
				css={css`
					width: max-content !important;
				`}
				aria-label={ariaLabel}
			>
				{icon !== undefined ? icon : children}
			</button>
		</MenuTrigger>
	);
};
