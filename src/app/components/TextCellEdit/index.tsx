import React from "react";

import Menu from "../Menu";
import { useTextareaRef } from "src/app/services/hooks";

import "./styles.css";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	width: number;
	height: number;
	value: string;
	onInputChange: (value: string) => void;
}

export default function TextCellEdit({
	menuId,
	isOpen,
	top,
	left,
	width,
	height,
	value,
	onInputChange,
}: Props) {
	const inputRef = useTextareaRef(isOpen, value);

	function handleTextareaChange(value: string) {
		value = value.replace("\n", "");
		onInputChange(value);
	}

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
				className="NLT__textarea"
				ref={inputRef}
				autoFocus
				value={value}
				onChange={(e) => handleTextareaChange(e.target.value)}
			/>
		</Menu>
	);
}
