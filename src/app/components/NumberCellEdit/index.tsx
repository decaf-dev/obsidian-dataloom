import React from "react";
import { useTextareaRef } from "src/app/services/hooks";

import Menu from "../Menu";

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

export default function NumberCellEdit({
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

	function handleInputChange(value: string) {
		value = value.replace("\n", "");
		return onInputChange(value);
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
			<input
				className="NLT__number-cell-edit"
				ref={inputRef}
				autoFocus
				value={value}
				onChange={(e) => handleInputChange(e.target.value)}
			/>
		</Menu>
	);
}
