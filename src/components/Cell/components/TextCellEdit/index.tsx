import { useEffect, useRef, useState } from "react";

import "./styles.css";

interface Props {
	value: string;
	onInputChange: (value: string) => void;
}

export default function TextCellEdit({ value, onInputChange }: Props) {
	const [isShiftDown, setShiftDown] = useState(false);
	const [isEnterPressed, setEnterPressed] = useState(false);
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
		if (e.code === "Enter") setEnterPressed(true);
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (!e.shiftKey) setShiftDown(false);
		if (e.code != "Enter") setEnterPressed(false);
	}

	function handleTextareaChange(newValue: string) {
		if (inputRef.current) {
			//If the user presses enter, a new line character will be added.
			//We want to remove this character if the menu closes. This happens when shift is not being pressed.
			if (!isShiftDown && isEnterPressed) {
				//Remove new line character
				newValue =
					newValue.substring(0, inputRef.current.selectionStart - 1) +
					newValue.substring(inputRef.current.selectionStart);
			}
			onInputChange(newValue);
		}
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
