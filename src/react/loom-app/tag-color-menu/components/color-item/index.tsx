import React from "react";

import Text from "src/react/shared/text";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";

import { findColorClassName } from "src/shared/color";
import { Color } from "src/shared/loom-state/types";
import { uppercaseFirst } from "src/shared/stringUtils";

import "./styles.css";

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
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			//Stop propagation so the the menu doesn't close when pressing enter
			e.stopPropagation();
			onColorClick(color);
		}
	}

	let containerClass =
		"dataloom-color-item dataloom-focusable dataloom-selectable";
	if (isSelected) containerClass += " dataloom-selected";

	const colorClass = findColorClassName(isDarkMode, color);

	let squareClass = "dataloom-color-item__square";
	squareClass += " " + colorClass;

	return (
		<div
			tabIndex={0}
			className={containerClass}
			onKeyDown={handleKeyDown}
			onClick={() => {
				onColorClick(color);
			}}
		>
			<Padding px="lg" py="sm">
				<Stack isHorizontal spacing="lg">
					<div className={squareClass}></div>
					<Text value={uppercaseFirst(color)} size="sm" />
				</Stack>
			</Padding>
		</div>
	);
}
