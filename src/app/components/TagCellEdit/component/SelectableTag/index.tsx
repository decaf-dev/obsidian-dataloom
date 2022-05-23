import React, { useState } from "react";

import parse from "html-react-parser";

import { v4 as uuidv4 } from "uuid";

import { findColorClass } from "src/app/services/color";

import { ICON, MENU_LEVEL } from "src/app/constants";
import "./styles.css";
import IconButton from "src/app/components/IconButton";
import TagColorMenu from "src/app/components/TagColorMenu";
import { useMenu } from "src/app/components/MenuProvider";
interface Props {
	id: string;
	content: string;
	color: string;
	onClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function SelectableTag({
	id,
	content,
	color,
	onClick,
	onColorChange,
}: Props) {
	const { openMenu, closeMenu, isMenuOpen } = useMenu();
	const [menuId] = useState(uuidv4());
	let tagClass = "NLT__tag";
	tagClass += " " + findColorClass(color);

	function handleColorChange(color: string) {
		onColorChange(id, color);
		closeMenu(menuId);
	}
	return (
		<div
			className="NLT__selectable-tag NLT__selectable"
			onClick={() => onClick(id)}
		>
			<div className={tagClass}>
				<div className="NLT__tag-content">{parse(content)}</div>
			</div>
			<IconButton
				icon={ICON.MORE_HORIZ}
				onClick={(e) => {
					e.stopPropagation();
					openMenu(menuId, MENU_LEVEL.TWO);
				}}
			/>
			<TagColorMenu
				menuId={menuId}
				isOpen={isMenuOpen(menuId)}
				selectedColor={color}
				top={-100}
				left={-120}
				onColorClick={(color) => handleColorChange(color)}
			/>
		</div>
	);
}
