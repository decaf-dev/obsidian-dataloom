import React from "react";

import Menu from "../Menu";
import { useTextareaRef } from "src/app/services/hooks";

import "./styles.css";

interface Props {
	menuId: string;
	isOpen: boolean;
	useAutoWidth: boolean;
	shouldWrapOverflow: boolean;
	style: {
		top: string;
		left: string;
		width: string;
		height: string;
		maxWidth?: string;
		minWidth?: string;
		minHeight?: string;
	};
	value: string;
	onInputChange: (value: string) => void;
}

export default function TextCellEdit({
	menuId,
	isOpen,
	style,
	useAutoWidth,
	shouldWrapOverflow,
	value,
	onInputChange,
}: Props) {
	const inputRef = useTextareaRef(isOpen, value);

	function handleTextareaChange(value: string) {
		value = value.replace("\n", "");
		onInputChange(value);
	}

	return (
		<Menu id={menuId} isOpen={isOpen} style={style}>
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
