import React, { useCallback } from "react";

import Menu from "../Menu";

import TagCell from "../TagCell";
import { Tag } from "src/app/services/appData/state/tag";
import SelectableTag from "../TagCellEdit/component/SelectableTag";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	width: string;
	height: string;
	color: string;
	inputText: string;
	cellId: string;
	tags: Tag[];
	onInputChange: (value: string) => void;
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
	width,
	height,
	color,
	inputText,
	cellId,
	tags,
	onInputChange,
	onTagClick,
	onAddTag,
	onColorChange,
	onRemoveTagClick,
}: Props) {
	const inputRef = useCallback(
		(node) => {
			if (node) {
				if (node instanceof HTMLElement) {
					if (isOpen) {
						setTimeout(() => {
							node.focus();
						}, 0);
					}
				}
			}
		},
		[isOpen]
	);

	function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
		//Disallow pound
		if (e.target.value.match("#")) return;
		//Disallow whitespace
		if (e.target.value.match(/\s/)) return;
		onInputChange(e.target.value);
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
		<Menu
			id={menuId}
			isOpen={isOpen}
			top={top}
			left={left}
			width={width}
			height={height}
		>
			<div className="NLT__tag-menu-container">
				<div className="NLT__tag-menu-top">
					{/* {tags
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
						))} */}
					<input
						className="NLT__tag-menu-input"
						ref={inputRef}
						type="text"
						value={inputText}
						onChange={handleTextChange}
					/>
				</div>
				{/* <div className="NLT__tag-menu-bottom">
					<p className="NLT__tag-menu-text">
						Select an option or create one
					</p>
					<div>{renderSelectableTags()}</div>
				</div> */}
			</div>
		</Menu>
	);
}
