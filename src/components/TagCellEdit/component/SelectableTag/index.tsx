import React, { useEffect } from "react";

import parse from "html-react-parser";

import { findColorClass } from "src/services/color";

import IconButton from "src/components/IconButton";
import TagColorMenu from "src/components/TagColorMenu";
import { useMenu } from "src/components/MenuProvider";
import { useMenuId, usePositionRef } from "src/services/hooks";
import { numToPx, pxToNum } from "src/services/string/conversion";

import { Icon } from "src/services/icon/types";
import { MENU_LEVEL } from "src/constants";
import "./styles.css";
interface Props {
	id: string;
	content: string;
	color: string;
	positionUpdateTime: number;
	onClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function SelectableTag({
	id,
	content,
	color,
	positionUpdateTime,
	onClick,
	onColorChange,
}: Props) {
	const menuId = useMenuId();
	const { isMenuOpen, openMenu, closeMenu, isMenuRequestingClose } = useMenu(
		menuId,
		MENU_LEVEL.TWO
	);
	const { positionRef, position } = usePositionRef([positionUpdateTime]);

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
				icon={Icon.MORE_HORIZ}
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
				style={{
					top: numToPx(pxToNum(position.top) - 77),
					left: numToPx(pxToNum(position.left) + 110),
				}}
				onColorClick={(color) => handleColorChange(color)}
			/>
		</div>
	);
}
