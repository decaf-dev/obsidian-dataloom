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

	function handleTextareaChange(value: string) {
		//If shift is not being pressed, the user is not trying to insert a new line
		if (!isShiftDown) value = value.replace("\n", "");
		onInputChange(value);
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
