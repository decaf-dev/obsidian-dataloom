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
import { Cell, Tag, CellType } from "src/services/appData/state/types";
import { isDate } from "src/services/string/validators";

import "./styles.css";

import { DEBUG } from "../../constants";
import { useDidMountEffect, useId } from "src/services/hooks";
import { dateToString } from "src/services/string/parsers";
import { logFunc } from "src/services/appData/debug";
import { useMenuId } from "src/components/MenuProvider";
import { usePositionRef } from "src/services/hooks";

interface Props {
	headerType: string;
	cell: Cell;
	width: string;
	height: string;
	positionUpdateTime: number;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	tagUpdate: {
		cellId: string;
		time: number;
	};
	tags: Tag[];
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onTagClick: (cellId: string, tagId: string) => void;
	onContentChange: (
		cellId: string,
		headerType: string,
		updatedContent: string,
		saveOnChange?: boolean
	) => void;
	onAddTag: (
		cellId: string,
		headerId: string,
		inputText: string,
		color: string
	) => void;
	onColorChange: (tagId: string, color: string) => void;
	onSaveContent: () => void;
}

const COMPONENT_NAME = "EditableTd";

export default function EditableTd({
	headerType,
	cell,
	width,
	height,
	positionUpdateTime,
	shouldWrapOverflow,
	useAutoWidth,
	tags,
	tagUpdate,
	onRemoveTagClick,
	onColorChange,
	onTagClick,
	onContentChange,
	onSaveContent,
	onAddTag,
}: Props) {
	const [tagInputText, setTagInputText] = useState("");
	const [tagColor] = useState(randomColor());
	const menuId = useId();
	const content = cell.content;

	const { isMenuOpen, openMenu, closeMenu, isMenuRequestingClose } =
		useMenuId(menuId);

	const { positionRef, position } = usePositionRef([
		content.length,
		positionUpdateTime,
	]);

	const { id, headerId, type } = cell;

	const [wasContentUpdated, setContentUpdate] = useState(false);

	const isInvalidContent = type !== headerType;

	//If we've already mounted, meaning the application has loaded
	//and we updated a tag, then we will wait for it to update,
	//then we will close the menu and save
	//This prevents rerendering issues
	useDidMountEffect(() => {
		if (DEBUG.EDITABLE_TD)
			logFunc(COMPONENT_NAME, "useDidMountEffect", {
				tagUpdate,
			});

		if (tagUpdate.cellId === id) {
			closeMenu();
			onSaveContent();
		}
	}, [tagUpdate.cellId, tagUpdate.time]);

	useEffect(() => {
		if (DEBUG.EDITABLE_TD)
			logFunc(COMPONENT_NAME, "useEffect", {
				isMenuRequestingClose,
			});
		if (isMenuRequestingClose) {
			if (headerType === CellType.TAG) {
				if (tagInputText !== "") {
					const tag = tags.find(
						(tag) => tag.content === tagInputText
					);
					if (tag) {
						onTagClick(id, tag.id);
					} else {
						onAddTag(id, headerId, tagInputText, tagColor);
					}
					setTagInputText("");
				} else {
					closeMenu();
				}
			} else {
				closeMenu();
				//If we're just closing the menu from an outside click,
				//then don't save unless the content actually updated
				if (wasContentUpdated) {
					onSaveContent();
					setContentUpdate(false);
				}
			}
		}
	}, [isMenuRequestingClose]);

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
		openMenu();
	}

	function handleAddTag(value: string) {
		onAddTag(id, headerId, value, tagColor);
	}

	function handleTagClick(tagId: string) {
		onTagClick(id, tagId);
	}

	function handleTextInputChange(value: string) {
		onContentChange(id, headerType, value);
		setContentUpdate(true);
	}

	function handleNumberInputChange(value: string) {
		onContentChange(id, headerType, value);
		setContentUpdate(true);
	}

	function handleDateChange(date: Date) {
		const content = dateToString(date);
		onContentChange(id, headerType, content);
		setContentUpdate(true);
	}

	function handleCheckboxChange(isChecked: boolean) {
		const content = isChecked ? "[x]" : "[ ]";
		onContentChange(id, headerType, content, true);
	}

	function renderCell(): React.ReactNode {
		switch (type) {
			case CellType.TEXT:
				return (
					<TextCell
						text={content}
						shouldWrapOverflow={shouldWrapOverflow}
						useAutoWidth={useAutoWidth}
					/>
				);
			case CellType.NUMBER:
				return (
					<NumberCell
						number={content}
						shouldWrapOverflow={shouldWrapOverflow}
						useAutoWidth={useAutoWidth}
					/>
				);
			case CellType.TAG: {
				const tag = tags.find((tag) => tag.selected.includes(id));
				if (tag)
					return <TagCell content={tag.content} color={tag.color} />;
				return <></>;
			}
			case CellType.DATE:
				return <DateCell text={content} />;
			case CellType.CHECKBOX:
				return (
					<CheckboxCell
						isChecked={content.includes("x")}
						onCheckboxChange={handleCheckboxChange}
					/>
				);
			default:
				return <></>;
		}
	}

	function renderCellMenu() {
		switch (headerType) {
			case CellType.TEXT:
				return (
					<TextCellEdit
						menuId={menuId}
						isOpen={isMenuOpen}
						style={{
							...position,
							...((useAutoWidth || !shouldWrapOverflow) && {
								maxWidth: "300px",
							}),
							minWidth: "125px",
							minHeight: "75px",
						}}
						useAutoWidth={useAutoWidth}
						shouldWrapOverflow={shouldWrapOverflow}
						value={content}
						onInputChange={handleTextInputChange}
					/>
				);
			case CellType.NUMBER:
				return (
					<NumberCellEdit
						menuId={menuId}
						isOpen={isMenuOpen}
						style={{
							...position,
							...((useAutoWidth || !shouldWrapOverflow) && {
								maxWidth: "300px",
							}),
							minWidth: "125px",
						}}
						value={content}
						onInputChange={handleNumberInputChange}
					/>
				);
			case CellType.TAG:
				return (
					<TagCellEdit
						cellId={id}
						inputText={tagInputText}
						positionUpdateTime={positionUpdateTime}
						tags={tags}
						menuId={menuId}
						isOpen={isMenuOpen}
						style={{
							top: position.top,
							left: position.left,
						}}
						color={tagColor}
						onInputChange={setTagInputText}
						onColorChange={onColorChange}
						onAddTag={handleAddTag}
						onRemoveTagClick={onRemoveTagClick}
						onTagClick={handleTagClick}
					/>
				);
			case CellType.DATE:
				return (
					<DateCellEdit
						menuId={menuId}
						isOpen={isMenuOpen}
						style={position}
						selectedDate={
							isDate(content) ? new Date(content) : new Date()
						}
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
