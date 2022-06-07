import { isNumber } from "lodash";
import React, { useCallback } from "react";
import { useTextareaRef } from "src/app/services/hooks";

import Menu from "../Menu";

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
		if (value != "" && isNumber(value)) return;
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
			<textarea
				className="NLT__textarea"
				ref={inputRef}
				autoFocus
				value={value}
				onChange={(e) => handleInputChange(e.target.value)}
			/>
		</Menu>
	);
}
