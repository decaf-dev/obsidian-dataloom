import React from "react";

import Menu from "../Menu";
import Tag from "../Tag";
import SelectableTag from "./component/SelectableTag";
import CreateTag from "./component/CreateTag";

import "./styles.css";

interface Props {
	menuId: string;
	isOpen: boolean;
	inputText: string;
	style: {
		top: string;
		left: string;
	};
	color: string;
	cellId: string;
	positionUpdateTime: number;
	onInputChange: (value: string) => void;
	onTagClick: (tagId: string) => void;
	onAddTag: (inputText: string) => void;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function TagCellEdit({
	menuId,
	isOpen,
	inputText,
	style,
	color,
	cellId,
	positionUpdateTime,
	onInputChange,
	onTagClick,
	onAddTag,
	onColorChange,
	onRemoveTagClick,
}: Props) {
	function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
		//Disallow whitespace
		if (e.target.value.match(/\s/)) return;
		onInputChange(e.target.value);
	}

	function renderSelectableTags() {
		// const filteredTags = tags.filter((tag: TagState) =>
		// 	tag.content.includes(inputText)
		// );
		// const found = tags.find((tag: TagState) => tag.content === inputText);
		return (
			<>
				{/* {!found && inputText !== "" && (
					<CreateTag
						key="create-tag"
						content={inputText}
						color={color}
						onAddTag={onAddTag}
					/>
				)}
				{filteredTags
					.filter((tag) => tag.content !== "")
					.map((tag: TagState) => (
						<SelectableTag
							key={tag.id}
							id={tag.id}
							color={tag.color}
							content={tag.content}
							positionUpdateTime={positionUpdateTime}
							onColorChange={onColorChange}
							onClick={onTagClick}
						/>
					))}*/}
			</>
		);
	}

	return (
		<Menu id={menuId} isOpen={isOpen} style={style}>
			{/* <div className="NLT__tag-menu">
				<div className="NLT__tag-menu-container">
					<div className="NLT__tag-menu-top">
						{tags
							.filter(
								(tag: TagState) =>
									tag.selected.includes(cellId) === true
							)
							.map((tag: TagState) => (
								<Tag
									key={tag.id}
									id={tag.id}
									color={tag.color}
									content={tag.content}
									showRemove={true}
									onRemoveClick={(tagId) =>
										onRemoveTagClick(cellId, tagId)
									}
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
			</div> */}
		</Menu>
	);
}
