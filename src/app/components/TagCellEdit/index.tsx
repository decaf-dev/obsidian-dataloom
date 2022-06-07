import React, { useState } from "react";

import Menu from "../Menu";

import TagCell from "../TagCell";
import { Tag } from "src/app/services/appData/state/tag";
import SelectableTag from "../TagCellEdit/component/SelectableTag";
import CreateTag from "./component/CreateTag";

import "./styles.css";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	color: string;
	cellId: string;
	tags: Tag[];
	onTagClick: (tagId: string) => void;
	onAddTag: (inputText: string) => void;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function TagCellEdit({
	menuId,
	isOpen,
	top,
	left,
	color,
	cellId,
	tags,
	onTagClick,
	onAddTag,
	onColorChange,
	onRemoveTagClick,
}: Props) {
	const [inputText, setInputText] = useState("");
	function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
		//Disallow whitespace
		if (e.target.value.match(/\s/)) return;
		setInputText(e.target.value);
	}

	function renderSelectableTags() {
		const filteredTags = tags.filter((tag: Tag) =>
			tag.content.includes(inputText)
		);
		const found = tags.find((tag: Tag) => tag.content === inputText);
		return (
			<>
				{!found && inputText !== "" && (
					<CreateTag
						key="create-tag"
						content={inputText}
						color={color}
						onAddTag={onAddTag}
					/>
				)}
				{filteredTags.map((tag: Tag) => (
					<SelectableTag
						key={tag.id}
						id={tag.id}
						color={tag.color}
						content={tag.content}
						onColorChange={onColorChange}
						onClick={onTagClick}
					/>
				))}
			</>
		);
	}

	return (
		<Menu id={menuId} isOpen={isOpen} top={top} left={left}>
			<div className="NLT__tag-menu">
				<div className="NLT__tag-menu-container">
					<div className="NLT__tag-menu-top">
						{tags
							.filter(
								(tag: Tag) =>
									tag.selected.includes(cellId) === true
							)
							.map((tag: Tag) => (
								<TagCell
									key={tag.id}
									cellId={cellId}
									id={tag.id}
									hideLink={true}
									color={tag.color}
									content={tag.content}
									showRemove={true}
									onRemoveClick={onRemoveTagClick}
								/>
							))}
						<input
							className="NLT__tag-input"
							autoFocus={true}
							type="text"
							value={inputText}
							onChange={handleTextChange}
						/>
					</div>
					<div className="NLT__tag-menu-bottom">
						<p className="NLT__tag-menu-text">
							Select an option or create one
						</p>
						<div>{renderSelectableTags()}</div>
					</div>
				</div>
			</div>
		</Menu>
	);
}
