import React, { useState } from "react";

import { Tag as TagType } from "../../../../services/tableState/types";

import { randomColor } from "src/services/random";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { closeTopLevelMenu } from "src/services/menu/menuSlice";

import "./styles.css";
import MenuHeader from "./component/MenuHeader";
import MenuBody from "./component/MenuBody";

interface Props {
	tags: TagType[];
	cellId: string;
	onTagClick: (tagId: string) => void;
	onAddTag: (markdown: string, color: string) => void;
	onRemoveTag: (tagId: string) => void;
	onTagColorChange: (tagId: string, color: string) => void;
	onTagDeleteClick: (tagId: string) => void;
}

export default function TagCellEdit({
	tags,
	cellId,
	onTagClick,
	onAddTag,
	onTagColorChange,
	onTagDeleteClick,
	onRemoveTag,
}: Props) {
	const [inputText, setInputText] = useState("");
	const [generatedColor] = useState(randomColor());
	const dispatch = useAppDispatch();
	const { isDarkMode } = useAppSelector((state) => state.global);

	function handleInputTextChange(e: React.ChangeEvent<HTMLInputElement>) {
		//Disallow whitespace
		if (e.target.value.match(/\s/)) return;
		setInputText(e.target.value);
	}

	function handleAddTag(markdown: string, color: string) {
		onAddTag(markdown, color);
		setInputText("");
		dispatch(closeTopLevelMenu());
	}

	return (
		<div className="NLT__tag-menu">
			<div className="NLT__tag-menu-container">
				<MenuHeader
					isDarkMode={isDarkMode}
					cellId={cellId}
					inputText={inputText}
					tags={tags}
					onInputTextChange={handleInputTextChange}
					onRemoveTag={onRemoveTag}
				/>
				<MenuBody
					isDarkMode={isDarkMode}
					inputText={inputText}
					tags={tags}
					generatedColor={generatedColor}
					onAddTag={handleAddTag}
					onTagClick={onTagClick}
					onTagDeleteClick={onTagDeleteClick}
					onTagColorChange={onTagColorChange}
				/>
			</div>
		</div>
	);
}
