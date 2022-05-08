import React, { useCallback, useState } from "react";

import Menu from "../Menu";
import TagMenuContent from "../TagMenuContent";
import { Tag } from "src/app/services/appData/state/tag";
import { CELL_TYPE } from "../../constants";
import "./styles.css";

interface Props {
	isOpen: boolean;
	cellType: string;
	inputText: string;
	tagColor: string;
	cellId: string;
	tags: Tag[];
	style: object;
	onInputChange: (value: string) => void;
	onTagClick: (tagId: string) => void;
	onAddTag: (inputText: string) => void;
	onTabPress: () => void;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onOutsideClick: () => void;
}

export default function CellEditMenu({
	isOpen,
	cellType,
	cellId,
	tags,
	inputText,
	tagColor,
	style,
	onInputChange,
	onTabPress,
	onRemoveTagClick,
	onAddTag,
	onTagClick,
	onOutsideClick,
}: Props) {
	const [textareaHeight, setTextareaHeight] = useState("auto");

	const textAreaRef = useCallback(
		(node) => {
			if (node) {
				if (isOpen) {
					//Sometimes the node won't focus. This seems to be a reoccuring issue
					//with using this inputRef
					node.selectionStart = inputText.length;
					node.selectionEnd = inputText.length;

					//console.log(node.getBoundingClientRect());
					setTimeout(() => {
						node.focus();
						if (node instanceof HTMLElement) {
							setTextareaHeight(`${node.scrollHeight}px`);
						}
					}, 1);
				}
			}
		},
		[isOpen]
	);

	const inputRef = useCallback(
		(node) => {
			if (node) {
				if (isOpen) {
					//Sometimes the node won't focus. This seems to be a reoccuring issue
					//with using this inputRef
					//console.log(node.getBoundingClientRect());
					setTimeout(() => {
						node.focus();
					}, 1);
				}
			}
		},
		[isOpen]
	);

	function renderContent() {
		switch (cellType) {
			case CELL_TYPE.TEXT:
				return (
					<textarea
						className="NLT__input NLT__input--textarea"
						ref={textAreaRef}
						style={{
							height: textareaHeight,
						}}
						autoFocus
						value={inputText}
						onChange={(e) =>
							onInputChange(e.target.value.replace("\n", ""))
						}
					/>
				);
			case CELL_TYPE.NUMBER:
				return (
					<input
						ref={inputRef}
						className="NLT__input NLT__input--number"
						type="number"
						autoFocus
						value={inputText}
						onChange={(e) => onInputChange(e.target.value)}
					/>
				);
			case CELL_TYPE.TAG:
				return (
					<TagMenuContent
						isOpen={isOpen}
						cellId={cellId}
						tags={tags}
						color={tagColor}
						inputText={inputText}
						onAddTag={onAddTag}
						onTextChange={(e) => onInputChange(e.target.value)}
						onRemoveTagClick={onRemoveTagClick}
						onTagClick={onTagClick}
					/>
				);
			default:
				return <></>;
		}
	}

	return (
		<Menu
			isOpen={isOpen}
			style={style}
			onTabPress={onTabPress}
			onOutsideClick={onOutsideClick}
		>
			<div className="NLT__cell-edit-menu">{renderContent()}</div>
		</Menu>
	);
}
