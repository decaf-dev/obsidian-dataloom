import React from "react";

import Menu from "src/app/components/Menu";

import { COLOR } from "src/app/constants";
import ColorItem from "./components/ColorItem";
import "./styles.css";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	selectedColor: string;
	onColorClick: (color: string) => void;
}

export default function TagColorMenu({
	menuId,
	isOpen,
	top,
	left,
	selectedColor,
	onColorClick,
}: Props) {
	return (
		<Menu id={menuId} isOpen={isOpen} top={top} left={left}>
			<div className="NLT__tag-color-menu">
				<div className="NLT__tag-color-menu-title">Colors</div>
				<div className="NLT__tag-color-container">
					{Object.values(COLOR).map((color) => (
						<ColorItem
							key={color}
							color={color}
							onColorClick={onColorClick}
							isSelected={selectedColor === color}
						/>
					))}
				</div>
			</div>
		</Menu>
	);
}
