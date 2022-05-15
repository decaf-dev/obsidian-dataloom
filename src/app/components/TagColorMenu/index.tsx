import React from "react";

import Menu from "src/app/components/Menu";

import { COLOR } from "src/app/constants";
import ColorItem from "./components/ColorItem";
import "./styles.css";

interface Props {
	isOpen: boolean;
	style: object;
	selectedColor: string;
	onColorClick: (color: string) => void;
	onOutsideClick: () => void;
}

export default function TagColorMenu({
	isOpen,
	style,
	selectedColor,
	onColorClick,
	onOutsideClick,
}: Props) {
	return (
		<Menu isOpen={isOpen} style={style} onOutsideClick={onOutsideClick}>
			<div className="NLT__tag-color-menu">
				<div>Colors</div>
				<ul className="NLT__tag-color-ul">
					{Object.values(COLOR).map((color) => (
						<ColorItem
							key={color}
							color={color}
							onColorClick={onColorClick}
							isSelected={selectedColor === color}
						/>
					))}
				</ul>
			</div>
		</Menu>
	);
}
