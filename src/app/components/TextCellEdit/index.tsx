import React, { useCallback, useState } from "react";

import Menu from "../Menu";

import "./styles.css";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	width: string;
	inputText: string;
	onInputChange: (value: string) => void;
}

export default function TextCellEdit({
	menuId,
	isOpen,
	top,
	left,
	width,
	inputText,
	onInputChange,
}: Props) {
	const [height, setHeight] = useState(0);
	const textAreaRef = useCallback(
		(node) => {
			if (node) {
				if (isOpen) {
					node.selectionStart = inputText.length;
					node.selectionEnd = inputText.length;
					if (node instanceof HTMLElement) {
						setTimeout(() => {
							node.focus();
						}, 1);
					}
					if (node instanceof HTMLElement) {
						node.style.height = "auto";
						node.style.height = `${node.scrollHeight}px`;
						setHeight(node.scrollHeight);
					}
				}
			}
		},
		[isOpen, inputText.length]
	);

	return (
		<Menu
			id={menuId}
			isOpen={isOpen}
			top={top}
			left={left}
			width={width}
			height={`${height}px`}
		>
			<textarea
				className="NLT__textarea"
				ref={textAreaRef}
				autoFocus
				value={inputText}
				onChange={(e) =>
					onInputChange(e.target.value.replace("\n", ""))
				}
			/>
		</Menu>
	);
}
