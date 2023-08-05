import React from "react";

import "./styles.css";

interface Props {
	className?: string;
	isTransparent?: boolean;
	showBorder?: boolean;
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
			className,
			isTransparent,
			showBorder,
			hasError,
			value,
			placeholder,
			inputMode,
			onChange,
			onBlur,
		},
		ref
	) => {
		let newClassName = "dataloom-input dataloom-focusable";
		if (isTransparent) {
			newClassName += " dataloom-input--transparent";
		} else if (showBorder) {
			newClassName += " dataloom-input--border";
		}
		if (hasError) {
			newClassName += " dataloom-input--error";
		}
		if (className) {
			newClassName += " " + className;
		}
		if (inputMode === "numeric") {
			newClassName += " dataloom-input--numeric";
		}
		return (
			<input
				ref={ref}
				className={newClassName}
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
