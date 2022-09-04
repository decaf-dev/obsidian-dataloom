import React from "react";

import Menu from "src/components/Menu";

import { COLOR } from "src/constants";
import ColorItem from "./components/ColorItem";
import "./styles.css";

interface Props {
	menuId: string;
	isOpen: boolean;
	style: {
		top: string;
		left: string;
	};
	selectedColor: string;
	onColorClick: (color: string) => void;
}

export default function TagColorMenu({
	menuId,
	isOpen,
	style,
	selectedColor,
	onColorClick,
}: Props) {
	return (
		<Menu id={menuId} isOpen={isOpen} style={style}>
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
