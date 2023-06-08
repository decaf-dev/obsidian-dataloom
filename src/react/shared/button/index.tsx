import React from "react";

import { css } from "@emotion/react";
import "./styles.css";
import { Menu } from "src/shared/menu/types";
import { getButtonClassName } from "./utils";
import MenuTrigger from "../menu-trigger";

interface ButtonProps {
	inverted?: boolean;
	isLink?: boolean;
	isSimple?: boolean;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick: () => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

export const Button = ({
	isLink,
	inverted,
	children,
	ariaLabel = "",
	icon,
	isSimple,
	onClick,
	onMouseDown,
}: ButtonProps) => {
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			//Stop click event
			e.preventDefault();

			//Stop propagation so the the menu doesn't close when pressing enter
			e.stopPropagation();

			onClick();
		}
	}

	let className = getButtonClassName({
		isLink,
		isSimple,
		hasIcon: icon !== undefined,
	});

	className += " NLT__focusable";

	if (inverted) className += " NLT__focusable--inverted";

	return (
		<button
			className={className}
			css={css`
				width: max-content !important;
				height: fit-content;
			`}
			aria-label={ariaLabel}
			onKeyDown={handleKeyDown}
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
				tabIndex={-1}
				css={css`
					width: max-content !important;
					height: fit-content;
				`}
				aria-label={ariaLabel}
			>
				{icon !== undefined ? icon : children}
			</button>
		</MenuTrigger>
	);
};
