import React, { useState } from "react";

import parse from "html-react-parser";

import { findColorClass } from "src/app/services/color";

import { ICON } from "src/app/constants";
import "./styles.css";
import IconButton from "src/app/components/IconButton";
import TagColorMenu from "src/app/components/TagColorMenu";
interface Props {
	id: string;
	content: string;
	color: string;
	onClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

const INITIAL_TAG_OPEN_MENU_STATE = {
	isOpen: false,
};

export default function SelectableTag({
	id,
	content,
	color,
	onClick,
	onColorChange,
}: Props) {
	const [tagColorMenu, setTagColorMenu] = useState(
		INITIAL_TAG_OPEN_MENU_STATE
	);
	let tagClass = "NLT__tag";
	tagClass += " " + findColorClass(color);
	let cellClass = "NLT__tag-cell NLT__selectable-tag NLT__selectable";

	//If we have an empty cell, then don't return anything
	if (content === "") return <></>;

	return (
		<div className={cellClass} onClick={() => onClick(id)}>
			<div className={tagClass}>
				<div className="NLT__tag-content">{parse(content)}</div>
			</div>
			<IconButton
				icon={ICON.MORE_HORIZ}
				onClick={() => setTagColorMenu({ isOpen: true })}
			/>
			<TagColorMenu
				isOpen={tagColorMenu.isOpen}
				selectedColor={color}
				style={{}}
				// style={{
				// 	top: "20px",
				// 	left: "20px",
				// }}
				onColorClick={(color) => onColorChange(id, color)}
				onOutsideClick={() =>
					setTagColorMenu(INITIAL_TAG_OPEN_MENU_STATE)
				}
			/>
		</div>
	);
}
