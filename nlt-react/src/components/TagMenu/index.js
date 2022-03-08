import React from "react";
import TagCell from "../TagCell";

import "./styles.css";

export default function TagMenu({
	selectedTag = "",
	tags = [],
	text = "",
	onTagClick = null,
	onAddTag = null,
	onTextChange = null,
	onRemoveTagClick = null,
}) {
	return (
		<div className="NLT__tag-menu-container">
			<div className="NLT__tag-menu-top">
				{selectedTag && (
					<TagCell
						key={selectedTag.id}
						content={selectedTag.content}
						showClose={true}
						onRemoveClick={() => onRemoveTagClick(selectedTag.id)}
					/>
				)}
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
				<div>
					{text !== "" && (
						<TagCell
							key="new-tag"
							content={text}
							selectable={true}
							showClose={false}
							onClick={() => onAddTag(text)}
						/>
					)}
					{tags.map((tag) => (
						<TagCell
							key={tag.id}
							content={tag.content}
							showClose={false}
							onClick={() => onTagClick(tag.id)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
