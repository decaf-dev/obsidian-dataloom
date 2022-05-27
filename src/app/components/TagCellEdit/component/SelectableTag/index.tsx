import React from "react";

import parse from "html-react-parser";

import { findColorClass } from "src/app/services/color";

import { ICON, MENU_LEVEL } from "src/app/constants";
import "./styles.css";
import IconButton from "src/app/components/IconButton";
import TagColorMenu from "src/app/components/TagColorMenu";
import { useMenuId, useMenuRef } from "src/app/services/hooks";

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
	const menuId = useMenuId();
	const { menuPosition, menuRef, isMenuOpen, openMenu, closeMenu } =
		useMenuRef(menuId, MENU_LEVEL.TWO);

	function handleColorChange(color: string) {
		onColorChange(id, color);
		closeMenu();
	}

	let tagClass = "NLT__tag";
	tagClass += " " + findColorClass(color);
	return (
		<div
			ref={menuRef}
			className="NLT__selectable-tag NLT__selectable"
			onClick={() => onClick(id)}
		>
			<div className={tagClass}>
				<div className="NLT__tag-content">{parse(content)}</div>
			</div>
			<IconButton
				icon={ICON.MORE_HORIZ}
				onClick={(e) => {
					//Why does this close it??
					e.stopPropagation();
					openMenu();
				}}
			/>
			<TagColorMenu
				menuId={menuId}
				isOpen={isMenuOpen}
				selectedColor={color}
				top={menuPosition.top - 77}
				left={menuPosition.left + 110}
				onColorClick={(color) => handleColorChange(color)}
			/>
		</div>
	);
}
