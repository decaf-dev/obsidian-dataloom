import React, { useCallback, useEffect } from "react";

import TagCell from "../TagCell";
import { Tag } from "src/app/services/appData/state/tag";
import SelectableTag from "./component/SelectableTag";

import { useForceUpdate } from "src/app/services/hooks";

import "./styles.css";
interface Props {
	cellId: string;
	tags: Tag[];
	color: string;
	isOpen: boolean;
	inputText: string;
	onTextChange: React.ChangeEventHandler<HTMLInputElement>;
	onTagClick: (tagId: string) => void;
	onAddTag: (inputText: string) => void;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function TagMenuContent({
	cellId,
	tags = [],
	color = "",
	inputText,
	isOpen,
	onTagClick,
	onAddTag,
	onColorChange,
	onTextChange,
	onRemoveTagClick,
}: Props) {
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		forceUpdate();
	}, [forceUpdate]);

	const inputRef = useCallback(
		(node) => {
			if (node) {
				if (node instanceof HTMLElement) {
					if (isOpen) {
						//Sometimes the node won't focus. This seems to be a reoccuring issue
						//with using this inputRef
						//console.log(node.getBoundingClientRect());
						setTimeout(() => {
							node.focus();
						}, 1);
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
		onTextChange(e);
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
							hideLink={true}
							color={tag.color}
							content={tag.content}
							showRemove={true}
							onRemoveClick={onRemoveTagClick}
						/>
					))}
				<input
					className="NLT__tag-menu-input"
					ref={inputRef}
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
