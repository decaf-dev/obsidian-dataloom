import React from "react";

import "./styles.css";
import { isNumberInput } from "src/shared/match";

interface Props {
	id?: string;
	isTransparent?: boolean;
	isDisabled?: boolean;
	showBorder?: boolean;
	autoFocus?: boolean;
	focusOutline?: "default" | "accent" | "none";
	hasError?: boolean;
	value: string;
	placeholder?: string;
	isNumeric?: boolean;
	onKeyDown?: (event: React.KeyboardEvent) => void;
	onChange: (value: string) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
	(
		{
			id,
			isTransparent,
			showBorder,
			hasError,
			value,
			autoFocus = true,
			isDisabled = false,
			focusOutline = "accent",
			placeholder,
			isNumeric,
			onChange,
			onKeyDown,
			onBlur,
		},
		ref
	) => {
		function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
			const inputValue = e.target.value;
			if (isNumeric) {
				if (!isNumberInput(inputValue)) return;
			}
			onChange(inputValue);
		}

		let className = "dataloom-input dataloom-focusable";
		if (isTransparent) {
			className += " dataloom-input--transparent";
		} else if (showBorder) {
			className += " dataloom-input--border";
		}
		if (isNumeric) className += " dataloom-input--numeric";

		if (focusOutline === "default") {
			className += " dataloom-input__focus-outline--default";
		} else if (focusOutline === "none") {
			className += " dataloom-input__focus-outline--none";
		}

		if (hasError) className += " dataloom-input--error";

		return (
			<input
				id={id}
				ref={ref}
				className={className}
				placeholder={placeholder}
				disabled={isDisabled}
				type="text"
				inputMode={isNumeric ? "numeric" : undefined}
				autoFocus={autoFocus}
				value={value}
				onChange={handleChange}
				onKeyDown={onKeyDown}
				onBlur={onBlur}
			/>
		);
	}
);

export default Input;
