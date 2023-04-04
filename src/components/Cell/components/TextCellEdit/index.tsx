import { useEffect, useRef } from "react";

import "./styles.css";

interface Props {
	content: string;
	onInputChange: (updatedContent: string) => void;
}

export default function TextCellEdit({ content, onInputChange }: Props) {
	const inputRef = useRef<HTMLTextAreaElement | null>(null);

	function focusInput() {
		inputRef.current?.focus();
	}

	function setSelection(pos: number) {
		if (inputRef.current) {
			inputRef.current.selectionStart = pos;
			inputRef.current.selectionEnd = pos;
		}
	}

	useEffect(() => {
		focusInput();
		setSelection(content.length);
	}, []);

	function handleTextareaChange(value: string) {
		value = value.replace("\n", "");
		onInputChange(value);
	}

	return (
		<textarea
			className="NLT__textarea"
			ref={inputRef}
			autoFocus
			value={content}
			onChange={(e) => handleTextareaChange(e.target.value)}
		/>
	);
}
