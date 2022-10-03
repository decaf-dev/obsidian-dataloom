import { useEffect, useRef } from "react";

import Menu from "../Menu";

import { useCompare } from "src/services/hooks";

import "./styles.css";
import { replaceUnescapedPipes } from "src/services/io/utils";

interface Props {
	menuId: string;
	isOpen: boolean;
	style: {
		top: string;
		left: string;
		width: string;
		height: string;
		maxWidth?: string;
		minWidth?: string;
		minHeight?: string;
	};
	content: string;
	onInputChange: (updatedContent: string) => void;
}

export default function TextCellEdit({
	menuId,
	isOpen,
	style,
	content,
	onInputChange,
}: Props) {
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const lengthHasChanged = useCompare(content.length);

	function focusInput() {
		//Why does this one work?
		inputRef.current.focus();
	}

	function setSelection(pos: number) {
		inputRef.current.selectionStart = pos;
		inputRef.current.selectionEnd = pos;
	}

	useEffect(() => {
		if (isOpen && !lengthHasChanged) {
			focusInput();
			setSelection(content.length);
		}
	}, [isOpen, lengthHasChanged]);

	function handleTextareaChange(value: string) {
		value = value.replace("\n", "");
		value = replaceUnescapedPipes(value);
		onInputChange(value);
	}

	return (
		<Menu id={menuId} isOpen={isOpen} style={style}>
			<textarea
				className="NLT__textarea"
				ref={inputRef}
				autoFocus
				value={content}
				onChange={(e) => handleTextareaChange(e.target.value)}
			/>
		</Menu>
	);
}
