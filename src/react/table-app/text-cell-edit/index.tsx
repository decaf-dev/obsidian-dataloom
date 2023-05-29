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
	onChange: (value: string) => void;
}

export default function TextCellEdit({
	shouldWrapOverflow,
	value,
	onChange,
}: Props) {
	const inputRef = useFocusMenuTextArea(value, (updatedValue) =>
		handleTextareaChange(updatedValue, true)
	);
	const { setPreviousSelectionStart } = useInputSelection(inputRef, value);

	function handleTextareaChange(
		inputValue: string,
		setSelectionToLength = false
	) {
		//When we press the menu key, an extra character will be added
		//we need to update the selection to be after this character
		//Otherwise keep the selection where it was
		if (inputRef.current) {
			if (setSelectionToLength) {
				setPreviousSelectionStart(inputValue.length);
			} else {
				setPreviousSelectionStart(inputRef.current.selectionStart);
			}
		}
		onChange(inputValue);
	}

	const className = useOverflowClassName(shouldWrapOverflow);
	return (
		<div className="NLT__text-cell-edit">
			<textarea
				className={className}
				ref={inputRef}
				value={value}
				onChange={(e) => handleTextareaChange(e.target.value)}
			/>
		</div>
	);
}
