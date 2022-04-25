import React from "react";

import TagCell from "../TagCell";

import { Tag } from "../../services/state";

import "./styles.css";

interface Props {
	cellId: string;
	tags: Tag[];
	color: string;
	inputText: string;
	onTagClick: (tagId: string) => void;
	onAddTag: (inputText: string) => void;
	onTextChange: React.ChangeEventHandler<HTMLInputElement>;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
}

export default function TagMenuContent({
	cellId,
	tags = [],
	color = "",
	inputText,
	onTagClick,
	onAddTag,
	onTextChange,
	onRemoveTagClick,
}: Props) {
	function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
		//Disallow pound
		if (e.target.value.match("#")) return;
		//Disallow whitespace
		if (e.target.value.match(/\s/)) return;
		onTextChange(e);
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			//If this tag content already exists then we will select that tag, otherwise add a new one
			const tag = tags.filter((tag) => tag.content === inputText)[0];
			if (tag) {
				onTagClick(tag.id);
			} else {
				onAddTag(inputText);
			}
		}
	}

	function renderSelectableTags() {
		const filteredTags = tags.filter((tag: Tag) =>
			tag.content.includes(inputText)
		);
		const found = tags.find((tag: Tag) => tag.content === inputText);
		return (
			<>
				{!found && inputText !== "" && (
					<TagCell
						key="new-tag"
						content={inputText}
						color={color}
						hideLink={true}
						isCreate={true}
						selectable={true}
						onClick={() => onAddTag(inputText)}
					/>
				)}
				{filteredTags.map((tag: Tag) => (
					<TagCell
						key={tag.id}
						id={tag.id}
						hideLink={true}
						color={tag.color}
						content={tag.content}
						selectable={true}
						onClick={onTagClick}
					/>
				))}
			</>
		);
	}
	return (
		<div className="NLT__tag-menu-container" onKeyDown={handleKeyDown}>
			<div className="NLT__tag-menu-top">
				{tags
					.filter(
						(tag: Tag) => tag.selected.includes(cellId) === true
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
					className="NLT__tag-menu-input"
					autoFocus
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
	);
}
