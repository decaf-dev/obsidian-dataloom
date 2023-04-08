import { useEffect, useRef, useState } from "react";

import "./styles.css";

interface Props {
	value: string;
	onInputChange: (value: string) => void;
}

export default function TextCellEdit({ value, onInputChange }: Props) {
	const [isShiftDown, setShiftDown] = useState(false);
	const inputRef = useRef<HTMLTextAreaElement | null>(null);

	useEffect(() => {
		focusInput();
		setSelection(value.length);
	}, []);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	function focusInput() {
		inputRef.current?.focus();
	}

	function setSelection(pos: number) {
		if (inputRef.current) {
			inputRef.current.selectionStart = pos;
			inputRef.current.selectionEnd = pos;
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.shiftKey) setShiftDown(true);
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (!e.shiftKey) setShiftDown(false);
	}

	function handleTextareaChange(newValue: string) {
		//When the user presses enter, a new line character is added.
		//If the user is holding the shift key, the edit menu will not close and a new line will be added.
		//Otherwise the edit menu will close and we want to delete the new line character added.
		if (!isShiftDown) {
			//We only want to change the value if the user is adding text. Otherwise, they will see a jump
			//when removing text when the last character is a new line character and it is removed.
			if (newValue.length > value.length) {
				if (newValue.endsWith("\n"))
					newValue = newValue.replace(/\n$/, "");
			}
		}
		onInputChange(newValue);
	}

	return (
		<textarea
			className="NLT__textarea"
			ref={inputRef}
			autoFocus
			value={value}
			onChange={(e) => handleTextareaChange(e.target.value)}
		/>
	);
}
