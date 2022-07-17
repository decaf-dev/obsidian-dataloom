import React, { useEffect } from "react";

import parse from "html-react-parser";

import { findColorClass } from "src/app/services/color";

import { ICON, MENU_LEVEL } from "src/app/constants";
import "./styles.css";
import IconButton from "src/app/components/IconButton";
import TagColorMenu from "src/app/components/TagColorMenu";
import { useMenuId, usePositionRef } from "src/app/services/hooks";
import { useMenu } from "src/app/components/MenuProvider";
interface Props {
	id: string;
	content: string;
	color: string;
	headerWidthUpdateTime: number;
	onClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function SelectableTag({
	id,
	content,
	color,
	headerWidthUpdateTime,
	onClick,
	onColorChange,
}: Props) {
	const menuId = useMenuId();
	const { isMenuOpen, openMenu, closeMenu, isMenuRequestingClose } = useMenu(
		menuId,
		MENU_LEVEL.TWO
	);
	const { positionRef, position } = usePositionRef([headerWidthUpdateTime]);

	useEffect(() => {
		if (isMenuRequestingClose) {
			closeMenu();
		}
	}, [isMenuRequestingClose]);

	function handleColorChange(color: string) {
		onColorChange(id, color);
		closeMenu();
	}

	let tagClass = "NLT__tag";
	tagClass += " " + findColorClass(color);
	return (
		<div
			ref={positionRef}
			className="NLT__selectable-tag NLT__selectable"
			onClick={() => onClick(id)}
		>
			<div className={tagClass}>
				<div className="NLT__tag-content">{parse(content)}</div>
			</div>
			<IconButton
				icon={ICON.MORE_HORIZ}
				onClick={(e) => {
					//Stop propagation so we don't call the onClick handler
					//on this div
					e.stopPropagation();
					openMenu();
				}}
			/>
			<TagColorMenu
				menuId={menuId}
				isOpen={isMenuOpen}
				selectedColor={color}
				top={position.top - 77}
				left={position.left + 110}
				onColorClick={(color) => handleColorChange(color)}
			/>
		</div>
	);
}
