import React, { useCallback } from "react";
import Menu from "../Menu";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	inputText: string;
	onInputChange: (value: string) => void;
}

export default function DateCellEdit({
	menuId,
	isOpen,
	top,
	left,
	inputText,
	onInputChange,
}: Props) {
	const inputRef = useCallback(
		(node) => {
			if (node) {
				if (isOpen) {
					setTimeout(() => {
						node.focus();
					}, 1);
				}
			}
		},
		[isOpen]
	);
	return (
		<Menu id={menuId} isOpen={isOpen} top={top} left={left}>
			<input
				ref={inputRef}
				className="NLT__input NLT__input--no-border"
				type="date"
				autoFocus
				value={inputText}
				onChange={(e) => onInputChange(e.target.value)}
			/>
		</Menu>
	);
}
