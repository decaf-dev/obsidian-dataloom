import React from "react";

import Stack from "../stack";
import type { ButtonSize, ButtonVariant } from "./types";

import Logger from "js-logger";
import "./styles.css";

interface ButtonProps {
	isDisabled?: boolean;
	variant?: ButtonVariant;
	size?: ButtonSize;
	isFullWidth?: boolean;
	isFocusable?: boolean;
	invertFocusColor?: boolean;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick?: () => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

export default function Button({
	isDisabled = false,
	variant = "text",
	isFullWidth,
	isFocusable = true,
	size = "md",
	invertFocusColor,
	children,
	ariaLabel = "",
	icon,
	onClick,
	onMouseDown,
}: ButtonProps) {
	function handleClick() {
		onClick?.();
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		Logger.trace("Button handleKeyDown");
		if (e.key === "Enter") {
			//Stop click event
			e.preventDefault();

			//Stop propagation so the the menu doesn't close when pressing enter
			e.stopPropagation();

			onClick?.();
		}
	}

	let className = "dataloom-button-old";

	if (isFocusable) {
		className += " dataloom-focusable";
		if (invertFocusColor) className += " dataloom-focusable--inverted";
	}

	if (variant == "link") className += " dataloom-button-old--link";
	else if (variant == "text") className += " dataloom-button-old--text";

	if (size == "sm") className += " dataloom-button-old--sm";
	else if (size == "md") className += " dataloom-button-old--md";
	else if (size == "lg") className += " dataloom-button-old--lg";

	if (isFullWidth) className += " dataloom-button-old--full-width";

	return (
		<button
			disabled={isDisabled}
			tabIndex={isFocusable ? 0 : -1}
			className={className}
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
