import React, { useCallback, useState } from "react";

import Menu from "../Menu";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	width: string;
	height: string;
	inputText: string;
	onInputChange: (value: string) => void;
}

export default function TextCellEdit({
	menuId,
	isOpen,
	top,
	left,
	width,
	height,
	inputText,
	onInputChange,
}: Props) {
	const [textareaHeight, setTextareaHeight] = useState("auto");

	const textAreaRef = useCallback(
		(node) => {
			if (node) {
				if (isOpen) {
					//Sometimes the node won't focus. This seems to be a reoccuring issue
					//with using this inputRef
					node.selectionStart = inputText.length;
					node.selectionEnd = inputText.length;

					setTimeout(() => {
						node.focus();
						if (node instanceof HTMLElement) {
							setTextareaHeight(`${node.scrollHeight}px`);
						}
					}, 1);
				}
			}
		},
		[isOpen]
	);
	return (
		<Menu
			id={menuId}
			isOpen={isOpen}
			top={top}
			left={left}
			width={width}
			height={height}
		>
			<textarea
				className="NLT__input NLT__input--textarea NLT__input--no-border"
				ref={textAreaRef}
				style={{
					height: textareaHeight,
				}}
				autoFocus
				value={inputText}
				onChange={(e) =>
					onInputChange(e.target.value.replace("\n", ""))
				}
			/>
		</Menu>
	);
}
