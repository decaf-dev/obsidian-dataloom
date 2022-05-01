import React, { useCallback, useEffect, useRef } from "react";

import Menu from "../Menu";
import TagMenuContent from "../TagMenuContent";
import { Tag } from "../../services/state";
import { CELL_TYPE } from "../../constants";

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
	onRemoveTagClick,
	onAddTag,
	onTagClick,
	onOutsideClick,
}: Props) {
	const firstOpen = useRef(false);

	useEffect(() => {
		if (isOpen) {
			firstOpen.current = true;
		} else {
			firstOpen.current = false;
		}
	}, [isOpen]);

	const textAreaRef = useCallback(
		(node) => {
			if (node) {
				if (cellType === CELL_TYPE.TEXT) {
					if (firstOpen && isOpen) {
						node.selectionStart = inputText.length;
						node.selectionEnd = inputText.length;
					}
				}
			}
		},
		[cellType, inputText.length, isOpen, firstOpen]
	);

	function renderContent() {
		switch (cellType) {
			case CELL_TYPE.TEXT:
				return (
					<textarea
						className="NLT__input"
						ref={textAreaRef}
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
		<Menu isOpen={isOpen} style={style} onOutsideClick={onOutsideClick}>
			{renderContent()}
		</Menu>
	);
}
