import React from "react";
import TagCell from "../TagCell";

import { Tag, randomColor } from "../../services/utils";

import "./styles.css";

interface Props {
	cellId: string;
	tags: Tag[];
	inputText: string;
	onTagClick: (tagId: string) => void;
	onAddTag: (inputText: string) => void;
	onTextChange: React.ChangeEventHandler<HTMLInputElement>;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
}

export default function TagMenu({
	cellId,
	tags = [],
	inputText,
	onTagClick,
	onAddTag,
	onTextChange,
	onRemoveTagClick,
}: Props) {
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
						color={randomColor()}
						isCreate={true}
						selectable={true}
						onClick={() => onAddTag(inputText)}
					/>
				)}
				{filteredTags.map((tag: Tag) => (
					<TagCell
						key={tag.id}
						id={tag.id}
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
		<div className="NLT__tag-menu-container">
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
					onChange={onTextChange}
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
