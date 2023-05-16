import React, { useEffect } from "react";

import {
	useCompare,
	useFocusMenuTextArea,
	useInputSelection,
} from "src/shared/hooks";
import { useOverflowClassName } from "src/shared/spacing/hooks";

import "./styles.css";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
	isMenuVisible: boolean;
	onChange: (value: string) => void;
}

export default function TextCellEdit({
	isMenuVisible,
	shouldWrapOverflow,
	value,
	onChange,
}: Props) {
	const inputRef = useFocusMenuTextArea(isMenuVisible, value, (value) =>
		handleTextareaChange(value, true)
	);
	const { setPreviousSelectionStart } = useInputSelection(inputRef, value);

	function handleTextareaChange(
		value: string,
		setSelectionToLength: boolean
	) {
		if (inputRef.current) {
			if (setSelectionToLength) {
				setPreviousSelectionStart(value.length);
			} else {
				setPreviousSelectionStart(inputRef.current.selectionStart);
			}
		}
		onChange(value);
	}

	const className = useOverflowClassName(shouldWrapOverflow);
	return (
		<div className="NLT__text-cell-edit">
			<textarea
				className={className}
				ref={inputRef}
				value={value}
				onChange={(e) => handleTextareaChange(e.target.value, false)}
			/>
		</div>
	);
}
