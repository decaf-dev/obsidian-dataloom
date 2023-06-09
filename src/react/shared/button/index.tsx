import React from "react";

import { css } from "@emotion/react";
import { useLogger } from "src/shared/logger";

export const buttonStyle = css`
	display: flex;
	align-items: center;
	width: max-content !important;
	height: max-content;
	padding: 10px !important; /* Prevent tablet styles */
	white-space: nowrap;
	color: var(--text-normal);
	margin-right: 0;
	cursor: pointer;

	&:focus-visible {
		box-shadow: none !important;
	}
`;

export const linkStyle = css`
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

export const iconStyle = css`
	background-color: transparent !important;
	box-shadow: none !important;
	padding: 6px !important;

	&: hover {
		box-shadow: var(--input-shadow) !important;
	}
`;

export const smallStyle = css`
	padding: 2px !important;
`;

interface ButtonProps {
	isFocusable?: boolean;
	invertFocusColor?: boolean;
	isLink?: boolean;
	isSmall?: boolean;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick?: () => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

export default function Button({
	isFocusable = true,
	isLink,
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

	let className = "NLT__button";

	if (isFocusable) {
		className += " NLT__focusable";
		if (invertFocusColor) className += " NLT__focusable--inverted";
	}

	return (
		<button
			tabIndex={isFocusable ? 0 : -1}
			className={className}
			css={css`
				${buttonStyle}
				${isLink ? linkStyle : undefined}
				${icon !== undefined ? iconStyle : undefined}
				${isSmall ? smallStyle : undefined}
			`}
			aria-label={ariaLabel}
			onKeyDown={handleKeyDown}
			onMouseDown={onMouseDown}
			onClick={handleClick}
		>
			{icon !== undefined ? icon : children}
		</button>
	);
}
