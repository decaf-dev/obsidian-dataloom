import { useState } from "react";

import { Tag as TagType } from "src/data/types";

import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { closeTopLevelMenu } from "src/services/menu/menuSlice";

import "./styles.css";
import MenuHeader from "./component/MenuHeader";
import MenuBody from "./component/MenuBody";
import { Color } from "src/shared/types";
import { MenuPosition } from "src/services/menu/types";
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
	const dispatch = useAppDispatch();
	const { isDarkMode } = useAppSelector((state) => state.global);

	function handleInputTextChange(value: string) {
		//Disallow whitespace
		if (value.match(/\s/)) return;
		setInputText(value);
	}

	function handleAddTag(markdown: string, color: Color) {
		onAddTag(markdown, color);
		setInputText("");
		dispatch(closeTopLevelMenu());
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
