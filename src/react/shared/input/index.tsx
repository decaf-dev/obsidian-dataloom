import React from "react";

import "./styles.css";

interface Props {
	isTransparent?: boolean;
	showBorder?: boolean;
	defaultOutline?: boolean;
	hasError?: boolean;
	value: string;
	placeholder?: string;
	inputMode?: "numeric";
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
			defaultOutline,
			placeholder,
			inputMode,
			onChange,
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
		if (defaultOutline) className += " dataloom-input--default-outline";
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
				onBlur={onBlur}
			/>
		);
	}
);

export default Input;
