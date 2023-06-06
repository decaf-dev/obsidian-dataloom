import React from "react";

import { css } from "@emotion/react";
import "./styles.css";
import { Menu } from "src/shared/menu/types";
import { getButtonClassName } from "./utils";

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
	const { id, level, shouldRequestOnClose } = menu;

	function handleMouseDown(e: React.MouseEvent) {
		onMouseDown?.(e);
	}

	function handleClick(e: React.MouseEvent) {
		onClick?.(e);
	}

	const className = getButtonClassName({
		isLink,
		isSimple,
		hasIcon: icon !== undefined,
	});

	return (
		<button
			className={"NLT__menu-trigger " + className}
			css={css`
				width: max-content !important;
			`}
			aria-label={ariaLabel}
			data-menu-id={id}
			data-menu-level={level}
			data-menu-should-request-on-close={shouldRequestOnClose}
			onMouseDown={handleMouseDown}
			onClick={handleClick}
		>
			{icon !== undefined ? icon : children}
		</button>
	);
};
