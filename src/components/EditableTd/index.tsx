import React, { useState, useEffect } from "react";

import { Notice } from "obsidian";
import TextCell from "../TextCell";
import TagCell from "../TagCell";
import CheckboxCell from "../CheckboxCell";
import DateCell from "../DateCell";
import NumberCell from "../NumberCell";
import NumberCellEdit from "../NumberCellEdit";
import TextCellEdit from "../TextCellEdit";
import TagCellEdit from "../TagCellEdit";
import DateCellEdit from "../DateCellEdit";

import { randomColor } from "src/services/random";
import { CellType } from "src/services/table/types";

import "./styles.css";

import { DEBUG } from "../../constants";
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import { usePositionRef } from "src/services/hooks";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { openMenu, isMenuOpen } from "src/services/menu/menuSlice";

interface Props {
	columnType: string;
	cellId: string;
	content: string;
	textContent: string;
	width: string;
	height: string;
	positionUpdateTime: number;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onTagClick: (cellId: string, tagId: string) => void;
	onContentChange: (cellId: string, updatedMarkdown: string) => void;
	onAddTag: (cellId: string, inputText: string, color: string) => void;
	onColorChange: (tagId: string, color: string) => void;
	onSaveContent: () => void;
}

const COMPONENT_NAME = "EditableTd";

export default function EditableTd({
	cellId,
	content,
	textContent,
	columnType,
	width,
	height,
	positionUpdateTime,
	shouldWrapOverflow,
	useAutoWidth,
	onRemoveTagClick,
	onColorChange,
	onTagClick,
	onContentChange,
	onSaveContent,
	onAddTag,
}: Props) {
	const [tagInputText, setTagInputText] = useState("");
	const [tagColor] = useState(randomColor());
	const menu = useMenu(MenuLevel.ONE);
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu));
	const dispatch = useAppDispatch();

	const { positionRef, position } = usePositionRef([
		content.length,
		positionUpdateTime,
	]);

	//If we've already mounted, meaning the application has loaded
	//and we updated a tag, then we will wait for it to update,
	//then we will close the menu and save
	//This prevents rerendering issues
	// useDidMountEffect(() => {
	// 	if (DEBUG.EDITABLE_TD)
	// 		logFunc(COMPONENT_NAME, "useDidMountEffect", {
	// 			tagUpdate,
	// 		});

	// 	if (tagUpdate.cellId === cellId) {
	// 		closeMenu();
	// 		onSaveContent();
	// 	}
	// }, [tagUpdate.cellId, tagUpdate.time]);

	// useEffect(() => {
	// 	if (DEBUG.EDITABLE_TD)
	// 		logFunc(COMPONENT_NAME, "useEffect", {
	// 			isMenuRequestingClose,
	// 		});
	// 	if (isMenuRequestingClose) {
	// 		if (columnType === CellType.TAG) {
	// 			if (tagInputText !== "") {
	// 				// const tag = tags.find(
	// 				// 	(tag) => tag.content === tagInputText
	// 				// );
	// 				// if (tag) {
	// 				// 	onTagClick(id, tag.id);
	// 				// } else {
	// 				// 	onAddTag(id, headerId, tagInputText, tagColor);
	// 				// }
	// 				setTagInputText("");
	// 			} else {
	// 				closeMenu(menu);
	// 			}
	// 		} else {
	// 			closeMenu(menu);
	// 			//If we're just closing the menu from an outside click,
	// 			//then don't save unless the content actually updated
	// 			if (wasContentUpdated) {
	// 				onSaveContent();
	// 				setContentUpdate(false);
	// 			}
	// 		}
	// 	}
	// }, [isMenuRequestingClose]);

	async function handleCellContextClick() {
		if (DEBUG.EDITABLE_TD)
			console.log("[EditableTd] handleCellContextClick()");
		try {
			await navigator.clipboard.writeText(content);
			new Notice("Cell text copied");
		} catch (err) {
			console.log(err);
		}
	}

	function handleCellClick(e: React.MouseEvent) {
		if (DEBUG.EDITABLE_TD) console.log("[EditableTd] handleCellClick()");
		const el = e.target as HTMLInputElement;

		//If we clicked on the link for a file or tag, return
		if (el.nodeName === "A") return;
		dispatch(openMenu(menu));
	}

	function handleAddTag(value: string) {
		onAddTag(cellId, value, tagColor);
	}

	function handleTagClick(tagId: string) {
		onTagClick(cellId, tagId);
	}

	function handleTextInputChange(updatedContent: string) {
		onContentChange(cellId, updatedContent);
	}

	function handleNumberInputChange(updatedContent: string) {
		onContentChange(cellId, updatedContent);
	}

	function handleDateChange(updatedContent: string) {
		onContentChange(cellId, updatedContent);
	}

	function handleCheckboxChange(updatedContent: string) {
		onContentChange(cellId, updatedContent);
	}

	function renderCell(): React.ReactNode {
		switch (columnType) {
			case CellType.TEXT:
				return (
					<TextCell
						content={textContent}
						shouldWrapOverflow={shouldWrapOverflow}
						useAutoWidth={useAutoWidth}
					/>
				);
			case CellType.NUMBER:
				return (
					<NumberCell
						content={textContent}
						shouldWrapOverflow={shouldWrapOverflow}
						useAutoWidth={useAutoWidth}
					/>
				);
			case CellType.TAG: {
				// const tag = tags.find((tag) => tag.selected.includes(id));
				// if (tag)
				// 	return <TagCell content={tag.content} color={tag.color} />;
				return <></>;
			}
			case CellType.DATE:
				return <DateCell content={content} />;
			case CellType.CHECKBOX:
				return (
					<CheckboxCell
						content={content}
						onCheckboxChange={handleCheckboxChange}
					/>
				);
			default:
				return <></>;
		}
	}

	function renderCellMenu() {
		switch (columnType) {
			case CellType.TEXT:
				return (
					<TextCellEdit
						menuId={menu.id}
						isOpen={isOpen}
						style={{
							...position,
							...((useAutoWidth || !shouldWrapOverflow) && {
								maxWidth: "300px",
							}),
							minWidth: "125px",
							minHeight: "75px",
						}}
						content={content}
						onInputChange={handleTextInputChange}
					/>
				);
			case CellType.NUMBER:
				return (
					<NumberCellEdit
						menuId={menu.id}
						isOpen={isOpen}
						style={{
							...position,
							...((useAutoWidth || !shouldWrapOverflow) && {
								maxWidth: "300px",
							}),
							minWidth: "125px",
						}}
						content={content}
						onInputChange={handleNumberInputChange}
					/>
				);
			case CellType.TAG:
				return <></>;
			//TODO add back
			// return (
			// 	<TagCellEdit
			// 		cellId={id}
			// 		inputText={tagInputText}
			// 		positionUpdateTime={positionUpdateTime}
			// 		tags={tags}
			// 		menuId={menuId}
			// 		isOpen={isOpen}
			// 		style={{
			// 			top: position.top,
			// 			left: position.left,
			// 		}}
			// 		color={tagColor}
			// 		onInputChange={setTagInputText}
			// 		onColorChange={onColorChange}
			// 		onAddTag={handleAddTag}
			// 		onRemoveTagClick={onRemoveTagClick}
			// 		onTagClick={handleTagClick}
			// 	/>
			// );
			case CellType.DATE:
				return (
					<DateCellEdit
						menuId={menu.id}
						isOpen={isOpen}
						style={position}
						content={content}
						onDateChange={handleDateChange}
					/>
				);
			default:
				return <></>;
		}
	}

	return (
		<>
			<td
				className="NLT__td"
				style={{
					width,
					height,
				}}
				ref={positionRef}
				onClick={handleCellClick}
				onContextMenu={handleCellContextClick}
			>
				<div className="NLT__td-container">{renderCell()}</div>
			</td>
			{renderCellMenu()}
		</>
	);
}
