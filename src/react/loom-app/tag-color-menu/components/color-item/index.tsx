import { findColorClassName } from "src/shared/color";
import { Color } from "src/shared/types";
import { uppercaseFirst } from "src/shared/stringUtils";
import "./styles.css";
import React from "react";

interface Props {
	isDarkMode: boolean;
	color: Color;
	isSelected: boolean;
	onColorClick: (color: Color) => void;
}

export default function ColorItem({
	isDarkMode,
	color,
	isSelected,
	onColorClick,
}: Props) {
	const ref = React.useRef(null);
	React.useEffect(() => {
		if (!ref.current) return;

		if (isSelected) {
			(ref.current as HTMLElement).focus();
		}
	}, [isSelected]);

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			//Stop propagation so the the menu doesn't close when pressing enter
			e.stopPropagation();
			onColorClick(color);
		}
	}

	let containerClass =
		"DataLoom__color-item DataLoom__focusable DataLoom__selectable";
	if (isSelected) containerClass += " DataLoom__selected";

	const colorClass = findColorClassName(isDarkMode, color);
	let squareClass = "DataLoom__color-item-square";
	squareClass += " " + colorClass;

	return (
		<div
			ref={ref}
			tabIndex={0}
			className={containerClass}
			onKeyDown={handleKeyDown}
			onClick={() => {
				onColorClick(color);
			}}
		>
			<div className={squareClass}></div>
			<div>{uppercaseFirst(color)}</div>
		</div>
	);
}
