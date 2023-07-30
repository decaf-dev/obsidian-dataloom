import React from "react";

import { css } from "@emotion/react";
import { useLogger } from "src/shared/logger";
import Stack from "../stack";
import { ButtonVariant } from "./types";

const buttonStyle = css`
	display: flex;
	align-items: center;
	width: max-content !important;
	height: max-content;
	padding: 6px !important;
	white-space: nowrap;
	color: var(--text-normal);
	margin-right: 0;
	cursor: pointer;

	&:focus-visible {
		box-shadow: none !important;
	}
`;

const linkStyle = css`
	color: var(--link-color);
	text-decoration-line: var(--link-decoration);
	cursor: var(--cursor-link);
	background-color: transparent !important;
	box-shadow: none !important;
	border: none !important;
	&:hover {
		box-shadow: var(--input-shadow) !important;
	}
`;

const textStyle = css`
	background-color: transparent !important;
	box-shadow: none !important;

	&: hover {
		background-color: var(--background-modifier-hover) !important;
	}
`;

export const smallStyle = css`
	padding: 2px !important;
`;

interface ButtonProps {
	variant?: ButtonVariant;
	isFocusable?: boolean;
	invertFocusColor?: boolean;
	isSmall?: boolean;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick?: () => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

export default function Button({
	variant = "text",
	isFocusable = true,
	isSmall,
	invertFocusColor,
	children,
	ariaLabel = "",
	icon,
	onClick,
	onMouseDown,
}: ButtonProps) {
	const logger = useLogger();
	function handleClick() {
		onClick?.();
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		logger("Button handleKeyDown");
		if (e.key === "Enter") {
			//Stop click event
			e.preventDefault();

			//Stop propagation so the the menu doesn't close when pressing enter
			e.stopPropagation();

			onClick?.();
		}
	}

	let className = "dataloom-button";

	if (isFocusable) {
		className += " DataLoom__focusable";
		if (invertFocusColor) className += " DataLoom__focusable--inverted";
	}

	return (
		<button
			tabIndex={isFocusable ? 0 : -1}
			className={className}
			css={css`
				${buttonStyle}
				${variant == "link" ? linkStyle : undefined}
				${variant == "text" ? textStyle : undefined}
				${isSmall ? smallStyle : undefined}
			`}
			aria-label={ariaLabel}
			onKeyDown={handleKeyDown}
			onMouseDown={onMouseDown}
			onClick={handleClick}
		>
			<Stack isHorizontal>
				{icon && icon}
				{children}
			</Stack>
		</button>
	);
}
