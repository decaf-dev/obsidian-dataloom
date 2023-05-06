import React from "react";

import MenuHeader from "./menu-header";
import MenuBody from "./menu-body";

import { Tag as TagType } from "src/data/types";
import { Color } from "src/shared/types";
import { MenuPosition } from "src/shared/menu/types";
import { randomColor } from "src/shared/colors";

import "./styles.css";

interface Props {
	tags: TagType[];
	cellId: string;
	menuPosition: MenuPosition;
	isMenuVisible: boolean;
	onTagClick: (tagId: string) => void;
	onAddTag: (markdown: string, color: Color) => void;
	onRemoveTag: (tagId: string) => void;
	onTagColorChange: (tagId: string, color: Color) => void;
	onTagDeleteClick: (tagId: string) => void;
}

export default function TagCellEdit({
	tags,
	cellId,
	menuPosition,
	isMenuVisible,
	onTagClick,
	onAddTag,
	onTagColorChange,
	onTagDeleteClick,
	onRemoveTag,
}: Props) {
	const [inputValue, setInputValue] = React.useState("");
	const [newTagColor] = React.useState(randomColor());

	function handleAddTag(markdown: string, color: Color) {
		onAddTag(markdown, color);
		setInputValue("");
	}

	return (
		<div className="NLT__tag-menu">
			<MenuHeader
				isMenuVisible={isMenuVisible}
				cellId={cellId}
				inputValue={inputValue}
				tags={tags}
				onInputValueChange={setInputValue}
				onRemoveTag={onRemoveTag}
			/>
			<MenuBody
				menuPosition={menuPosition}
				inputText={inputValue}
				tags={tags}
				newTagColor={newTagColor}
				onAddTag={handleAddTag}
				onTagClick={onTagClick}
				onTagDeleteClick={onTagDeleteClick}
				onTagColorChange={onTagColorChange}
			/>
		</div>
	);
}
