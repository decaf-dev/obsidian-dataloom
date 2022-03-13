import React from "react";
import TagCell from "../TagCell";

import "./styles.css";

export default function TagMenu({
	tags = [],
	text = "",
	onTagClick = null,
	onAddTag = null,
	onTextChange = null,
	onRemoveTagClick = null,
}) {
	function renderSelectableTags() {
		const filteredTags = tags.filter((tag) => tag.content.includes(text));
		const found = tags.find((tag) => tag.content === text);
		return (
			<>
				{!found && text !== "" && (
					<TagCell
						key="new-tag"
						content={text}
						isCreate={true}
						selectable={true}
						onClick={() => onAddTag(text)}
					/>
				)}
				{filteredTags.map((tag) => (
					<TagCell
						key={tag.id}
						content={tag.content}
						selectable={true}
						onClick={() => onTagClick(tag.id)}
					/>
				))}
			</>
		);
	}
	return (
		<div className="NLT__tag-menu-container">
			<div className="NLT__tag-menu-top">
				{tags
					.filter((tag) => tag.selected === true)
					.map((tag) => (
						<TagCell
							key={tag.id}
							id={tag.id}
							content={tag.content}
							showRemove={true}
							onRemoveClick={onRemoveTagClick}
						/>
					))}
				<input
					className="NLT__tag-menu-input"
					autoFocus
					type="text"
					value={text}
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
