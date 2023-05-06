import { useState } from "react";

import { Tag as TagType } from "src/data/types";

import { useAppSelector } from "src/redux/global/hooks";

import "./styles.css";
import MenuHeader from "./menu-header";
import MenuBody from "./menu-body";
import { Color } from "src/shared/types";
import { MenuPosition } from "src/shared/menu/types";
import { randomColor } from "src/shared/colors";

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
	const [inputText, setInputText] = useState("");
	const [newTagColor] = useState(randomColor());
	const { isDarkMode } = useAppSelector((state) => state.global);

	function handleInputTextChange(value: string) {
		setInputText(value);
	}

	function handleAddTag(markdown: string, color: Color) {
		onAddTag(markdown, color);
		setInputText("");
	}

	return (
		<div className="NLT__tag-menu">
			<div className="NLT__tag-menu-container">
				<MenuHeader
					isMenuVisible={isMenuVisible}
					isDarkMode={isDarkMode}
					cellId={cellId}
					inputText={inputText}
					tags={tags}
					onInputTextChange={handleInputTextChange}
					onRemoveTag={onRemoveTag}
				/>
				<MenuBody
					menuPosition={menuPosition}
					isDarkMode={isDarkMode}
					inputText={inputText}
					tags={tags}
					newTagColor={newTagColor}
					onAddTag={handleAddTag}
					onTagClick={onTagClick}
					onTagDeleteClick={onTagDeleteClick}
					onTagColorChange={onTagColorChange}
				/>
			</div>
		</div>
	);
}
