import React from "react";

import { css } from "@emotion/react";

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
	shouldInvert?: boolean;
	isLink?: boolean;
	isSmall?: boolean;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick: () => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

export default function Button({
	isLink,
	isSmall,
	shouldInvert,
	children,
	ariaLabel = "",
	icon,
	onClick,
	onMouseDown,
}: ButtonProps) {
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			//Stop click event
			e.preventDefault();

			//Stop propagation so the the menu doesn't close when pressing enter
			e.stopPropagation();

			onClick();
		}
	}

	let className = "NLT__button NLT__focusable";
	if (shouldInvert) className += " NLT__focusable--inverted";

	return (
		<button
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
			onClick={onClick}
		>
			{icon !== undefined ? icon : children}
		</button>
	);
}
