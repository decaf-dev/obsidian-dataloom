import React from "react";

import { useLogger } from "src/shared/logger";
import Stack from "../stack";
import { ButtonVariant } from "./types";

import "./styles.css";

interface ButtonProps {
	isDisabled?: boolean;
	variant?: ButtonVariant;
	isFullWidth?: boolean;
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
	isDisabled = false,
	variant = "text",
	isFullWidth,
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
		className += " dataloom-focusable";
		if (invertFocusColor) className += " dataloom-focusable--inverted";
	}

	if (variant == "link") className += " dataloom-button--link";
	else if (variant == "text") className += " dataloom-button--text";
	if (isSmall) className += " dataloom-button--small";
	if (isFullWidth) className += " dataloom-button--full-width";

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
