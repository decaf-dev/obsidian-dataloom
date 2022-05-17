import React from "react";

import { findColorClass } from "src/app/services/color";
import "./styles.css";

interface Props {
	color: string;
	isSelected: boolean;
	onColorClick: (color: string) => void;
}

export default function ColorItem({ color, isSelected, onColorClick }: Props) {
	let containerClass = "NLT__color-item NLT__selectable";
	if (isSelected) containerClass += " NLT__selected";

	const colorClass = findColorClass(color);
	let squareClass = "NLT__color-item-square";
	squareClass += " " + colorClass;

	return (
		<div
			className={containerClass}
			onClick={(e) => {
				//Stop event propagation so we don't select this cell
				e.stopPropagation();
				onColorClick(color);
			}}
		>
			<div className={squareClass}></div>
			<div>{color}</div>
		</div>
	);
}
