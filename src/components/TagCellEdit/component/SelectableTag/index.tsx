import React, { useEffect } from "react";

import parse from "html-react-parser";

import { findColorClass } from "src/services/color";

import IconButton from "src/components/IconButton";
import TagColorMenu from "src/components/TagColorMenu";
import { usePositionRef } from "src/services/hooks";
import { numToPx, pxToNum } from "src/services/string/conversion";

import { Icon } from "src/services/icon/types";
import { MenuLevel } from "src/services/menu/types";
import { useMenu } from "src/services/menu/hooks";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import {
	openMenu,
	isMenuOpen,
	closeTopLevelMenu,
} from "src/services/menu/menuSlice";

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
	const menu = useMenu(MenuLevel.TWO);
	const dispatch = useAppDispatch();
	const { positionRef, position } = usePositionRef([positionUpdateTime]);
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu));

	function handleColorChange(color: string) {
		onColorChange(id, color);
		dispatch(closeTopLevelMenu());
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
					dispatch(openMenu(menu));
				}}
			/>
			<TagColorMenu
				menuId={menu.id}
				isOpen={isOpen}
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
