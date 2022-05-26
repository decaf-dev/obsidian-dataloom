import React, { useState, useCallback } from "react";

import parse from "html-react-parser";

import { v4 as uuidv4 } from "uuid";

import { findColorClass } from "src/app/services/color";

import { ICON, MENU_LEVEL } from "src/app/constants";
import "./styles.css";
import IconButton from "src/app/components/IconButton";
import TagColorMenu from "src/app/components/TagColorMenu";
import { useMenu } from "src/app/components/MenuProvider";
import { useResizeTime } from "src/app/services/hooks";
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
	const [menuPosition, setMenuPosition] = useState({
		top: 0,
		left: 0,
	});
	const [menuId] = useState(uuidv4());
	const { isOpen, open, close } = useMenu(menuId, MENU_LEVEL.TWO);
	const resizeTime = useResizeTime();
	let tagClass = "NLT__tag";
	tagClass += " " + findColorClass(color);

	const divRef = useCallback(
		(node) => {
			if (node instanceof HTMLElement) {
				const { top, left } = node.getBoundingClientRect();
				setMenuPosition({ top, left });
			}
		},
		[isOpen, resizeTime]
	);

	function handleColorChange(color: string) {
		onColorChange(id, color);
		close();
	}
	return (
		<div
			ref={divRef}
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
					open();
				}}
			/>
			<TagColorMenu
				menuId={menuId}
				isOpen={isOpen}
				selectedColor={color}
				top={menuPosition.top - 77}
				left={menuPosition.left + 110}
				onColorClick={(color) => handleColorChange(color)}
			/>
		</div>
	);
}
