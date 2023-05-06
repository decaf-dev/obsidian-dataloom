import { useEffect, useState } from "react";

import { useFocusMenuTextArea, useInputSelection } from "src/shared/hooks";
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
	const [isShiftDown, setShiftDown] = useState(false);
	const [isEnterPressed, setEnterPressed] = useState(false);
	const inputRef = useFocusMenuTextArea(isMenuVisible, value, onChange);
	useInputSelection(isMenuVisible, inputRef, value.length);

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.shiftKey) setShiftDown(true);
		if (e.code === "Enter") setEnterPressed(true);
	}

	function handleKeyUp(e: React.KeyboardEvent) {
		if (!e.shiftKey) setShiftDown(false);
		if (e.code != "Enter") setEnterPressed(false);
	}

	function handleTextareaChange(value: string) {
		let updatedValue = value;
		if (inputRef.current) {
			//If the user presses enter, a new line character will be added.
			//We want to remove this character if the menu closes. This happens when shift is not being pressed.
			if (!isShiftDown && isEnterPressed) {
				//Remove new line character
				updatedValue =
					updatedValue.substring(
						0,
						inputRef.current.selectionStart - 1
					) + updatedValue.substring(inputRef.current.selectionStart);
			}
		}
		onChange(updatedValue);
	}

	const className = useOverflowClassName(shouldWrapOverflow);
	return (
		<div className="NLT__text-cell-edit">
			<textarea
				className={className}
				ref={inputRef}
				onKeyDown={handleKeyDown}
				onKeyUp={handleKeyUp}
				autoFocus
				value={value}
				onChange={(e) => handleTextareaChange(e.target.value)}
			/>
		</div>
	);
}
