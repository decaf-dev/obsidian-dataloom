import React, { useCallback, useRef, useState } from "react";

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
	const didMount = useRef(false);

	const textAreaRef = useCallback(
		(node) => {
			if (node) {
				if (isOpen) {
					if (!didMount.current) {
						node.selectionStart = inputText.length;
						node.selectionEnd = inputText.length;
						if (node instanceof HTMLElement) {
							setTimeout(() => {
								node.focus();
							}, 1);
						}
						didMount.current = true;
					} else {
						if (node instanceof HTMLElement) {
							node.style.height = "auto";
							node.style.height = node.scrollHeight + "px";
						}
					}
				}
			}
		},
		[isOpen, didMount.current, inputText.length]
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
				autoFocus
				value={inputText}
				onChange={(e) =>
					onInputChange(e.target.value.replace("\n", ""))
				}
			/>
		</Menu>
	);
}
