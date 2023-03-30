import React, { useState } from "react";

import Tag from "../Tag";
import SelectableTag from "./component/SelectableTag";
import CreateTag from "./component/CreateTag";
import { Tag as TagType } from "../../services/tableState/types";

import { randomColor } from "src/services/random";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { closeTopLevelMenu } from "src/services/menu/menuSlice";
import Wrap from "src/components/Wrap";

import "./styles.css";

interface MenuHeaderProps {
	isDarkMode: boolean;
	cellId: string;
	tags: TagType[];
	inputText: string;
	onInputTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onRemoveTag: (tagId: string) => void;
}

const MenuHeader = ({
	isDarkMode,
	cellId,
	tags,
	inputText,
	onInputTextChange,
	onRemoveTag,
}: MenuHeaderProps) => {
	return (
		<div className="NLT__tag-menu-header">
			<Wrap spacingX="sm" style={{ overflow: "hidden" }}>
				{tags
					.filter((tag: TagType) =>
						tag.cells.find((c) => c === cellId)
					)
					.map((tag: TagType) => (
						<Tag
							isDarkMode={isDarkMode}
							key={tag.id}
							id={tag.id}
							color={tag.color}
							markdown={tag.markdown}
							showRemove={true}
							onRemoveClick={(tagId) => onRemoveTag(tagId)}
						/>
					))}
				<input
					className="NLT__tag-input"
					autoFocus={true}
					type="text"
					value={inputText}
					onChange={onInputTextChange}
				/>
			</Wrap>
		</div>
	);
};

interface MenuBodyProps {
	isDarkMode: boolean;
	tags: TagType[];
	inputText: string;
	generatedColor: string;
	onAddTag: (markdown: string, color: string) => void;
	onTagClick: (tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

const MenuBody = ({
	isDarkMode,
	tags,
	inputText,
	generatedColor,
	onAddTag,
	onTagClick,
	onColorChange,
}: MenuBodyProps) => {
	const found = tags.find((tag: TagType) => tag.markdown === inputText);
	const filteredTags = tags.filter((tag: TagType) =>
		tag.markdown.includes(inputText)
	);
	return (
		<div className="NLT__tag-menu-body">
			<p className="NLT__tag-menu-text">Select an option or create one</p>
			<div
				style={{
					overflowY: "scroll",
					height: "140px",
				}}
			>
				{!found && inputText !== "" && (
					<CreateTag
						key="create-tag"
						isDarkMode={isDarkMode}
						markdown={inputText}
						color={generatedColor}
						onAddTag={onAddTag}
					/>
				)}
				{filteredTags.map((tag: TagType) => (
					<SelectableTag
						isDarkMode={isDarkMode}
						key={tag.id}
						id={tag.id}
						color={tag.color}
						markdown={tag.markdown}
						onColorChange={onColorChange}
						onClick={onTagClick}
					/>
				))}
			</div>
		</div>
	);
};

interface Props {
	tags: TagType[];
	cellId: string;
	onTagClick: (tagId: string) => void;
	onAddTag: (markdown: string, color: string) => void;
	onRemoveTag: (tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function TagCellEdit({
	tags,
	cellId,
	onTagClick,
	onAddTag,
	onColorChange,
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
					onColorChange={onColorChange}
				/>
			</div>
		</div>
	);
}
