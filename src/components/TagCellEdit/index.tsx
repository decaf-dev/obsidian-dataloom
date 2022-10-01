import React, { useState } from "react";

import Menu from "../Menu";
import Tag from "../Tag";
import SelectableTag from "./component/SelectableTag";
import CreateTag from "./component/CreateTag";
import { Tag as TagType } from "../../services/table/types";

import { randomColor } from "src/services/random";
import { markdownToHtml } from "src/services/io/deserialize";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { closeTopLevelMenu } from "src/services/menu/menuSlice";
import Wrap from "src/components/Wrap";

import "./styles.css";

interface MenuHeaderProps {
	isDarkMode: boolean;
	rowId: string;
	columnId: string;
	tags: TagType[];
	inputText: string;
	onInputTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onRemoveTag: (tagId: string) => void;
}

const MenuHeader = ({
	isDarkMode,
	rowId,
	columnId,
	tags,
	inputText,
	onInputTextChange,
	onRemoveTag,
}: MenuHeaderProps) => {
	return (
		<div className="NLT__tag-menu-header">
			<Wrap spacingX="sm">
				{tags
					.filter((tag: TagType) =>
						tag.cells.find(
							(c) => c.rowId === rowId && c.columnId === columnId
						)
					)
					.map((tag: TagType) => (
						<Tag
							isDarkMode={isDarkMode}
							key={tag.id}
							id={tag.id}
							color={tag.color}
							html={tag.html}
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
	onAddTag: (markdown: string, html: string, color: string) => void;
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
			<div>
				{!found && inputText !== "" && (
					<CreateTag
						key="create-tag"
						isDarkMode={isDarkMode}
						markdown={inputText}
						html={markdownToHtml(inputText)}
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
						html={tag.html}
						onColorChange={onColorChange}
						onClick={onTagClick}
					/>
				))}
			</div>
		</div>
	);
};

interface Props {
	menuId: string;
	isOpen: boolean;
	tags: TagType[];
	style: {
		top: string;
		left: string;
	};
	columnId: string;
	rowId: string;
	onTagClick: (tagId: string) => void;
	onAddTag: (markdown: string, html: string, color: string) => void;
	onRemoveTag: (tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function TagCellEdit({
	menuId,
	isOpen,
	style,
	tags,
	rowId,
	columnId,
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

	function handleAddTag(markdown: string, html: string, color: string) {
		onAddTag(markdown, html, color);
		setInputText("");
		dispatch(closeTopLevelMenu());
	}

	return (
		<Menu id={menuId} isOpen={isOpen} style={style}>
			<div className="NLT__tag-menu">
				<div className="NLT__tag-menu-container">
					<MenuHeader
						isDarkMode={isDarkMode}
						rowId={rowId}
						columnId={columnId}
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
		</Menu>
	);
}
