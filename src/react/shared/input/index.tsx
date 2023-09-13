import React from "react";

import "./styles.css";

interface Props {
	isTransparent?: boolean;
	showBorder?: boolean;
	focusOutline?: "default" | "accent" | "none";
	hasError?: boolean;
	value: string;
	placeholder?: string;
	inputMode?: "numeric";
	onKeyDown?: (event: React.KeyboardEvent) => void;
	onChange: (value: string) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
	(
		{
			isTransparent,
			showBorder,
			hasError,
			value,
			focusOutline = "accent",
			placeholder,
			inputMode,
			onChange,
			onKeyDown,
			onBlur,
		},
		ref
	) => {
		let className = "dataloom-input dataloom-focusable";
		if (isTransparent) {
			className += " dataloom-input--transparent";
		} else if (showBorder) {
			className += " dataloom-input--border";
		}
		if (inputMode === "numeric") className += " dataloom-input--numeric";

		if (focusOutline === "default") {
			className += " dataloom-input__focus-outline--default";
		} else if (focusOutline === "none") {
			className += " dataloom-input__focus-outline--none";
		}

		if (hasError) className += " dataloom-input--error";
		return (
			<input
				ref={ref}
				className={className}
				placeholder={placeholder}
				type="text"
				inputMode={inputMode}
				autoFocus
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={onKeyDown}
				onBlur={onBlur}
			/>
		);
	}
);

export default Input;
