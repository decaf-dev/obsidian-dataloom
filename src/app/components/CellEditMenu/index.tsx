import React, { useCallback, useEffect, useState, useRef } from "react";

import Menu from "../Menu";
import TagMenuContent from "../TagMenuContent";
import { Tag } from "../../services/state";
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
	const firstOpen = useRef(false);
	const [textareaHeight, setTextareaHeight] = useState("auto");
	const scrollHeight = useRef("");

	useEffect(() => {
		if (isOpen) {
			firstOpen.current = true;
		} else {
			firstOpen.current = false;
		}
	}, [isOpen]);

	useEffect(() => {
		if (textareaHeight === "auto") {
			setTextareaHeight(scrollHeight.current);
		}
	}, [textareaHeight]);

	const textAreaRef = useCallback(
		(node) => {
			if (node) {
				if (cellType === CELL_TYPE.TEXT) {
					if (firstOpen.current && isOpen) {
						node.selectionStart = inputText.length;
						node.selectionEnd = inputText.length;
						if (node instanceof HTMLElement) {
							setTimeout(() => {
								scrollHeight.current = `${node.scrollHeight}px`;
								setTextareaHeight("auto");
							}, 1);
						}
					}
				}
			}
		},
		[cellType, inputText.length, isOpen, firstOpen.current]
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
