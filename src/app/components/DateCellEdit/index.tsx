import React, { useCallback } from "react";
import Menu from "../Menu";

import "./styles.css";

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

export default function DateCellEdit({
	menuId,
	isOpen,
	top,
	left,
	width,
	height,
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
		<Menu
			id={menuId}
			isOpen={isOpen}
			top={top}
			left={left}
			width={width}
			height={height}
		>
			<input
				ref={inputRef}
				className="NLT__date-input"
				type="date"
				autoFocus
				value={inputText}
				onChange={(e) => onInputChange(e.target.value)}
			/>
		</Menu>
	);
}
