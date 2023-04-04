import React from "react";
import { Notice } from "obsidian";

import TextCell from "./components/TextCell";
import TagCell from "./components//TagCell";
import CheckboxCell from "./components/CheckboxCell";
import DateCell from "./components/DateCell";
import NumberCell from "./components/NumberCell";
import NumberCellEdit from "./components/NumberCellEdit";
import TextCellEdit from "./components/TextCellEdit";
import TagCellEdit from "./components/TagCellEdit";
import DateCellEdit from "./components/DateCellEdit";
import MultiTagCell from "./components/MultiTagCell";
import Menu from "../Menu";

import { CellType, Tag } from "src/services/tableState/types";
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { openMenu, isMenuOpen } from "src/services/menu/menuSlice";

import LastEditedTimeCell from "./components/LastEditedTimeCell";
import CreationTimeCell from "./components/CreationTimeCell";
import {
	CHECKBOX_MARKDOWN_CHECKED,
	CHECKBOX_MARKDOWN_UNCHECKED,
} from "src/services/tableState/constants";
import { isCheckboxChecked } from "src/services/string/validators";

import "./styles.css";
import { useDidMountEffect } from "src/services/hooks";
import { updateSortTime } from "src/services/redux/globalSlice";

interface Props {
	columnType: string;
	cellId: string;
	rowId: string;
	columnId: string;
	markdown: string;
	rowCreationTime: number;
	rowLastEditedTime: number;
	width: string;
	tags: Tag[];
	shouldWrapOverflow: boolean;
	hasAutoWidth: boolean;
	onRemoveTagClick: (cellId: string, rowId: string, tagId: string) => void;
	onTagClick: (
		cellId: string,
		rowId: string,
		tagId: string,
		canAddMultiple: boolean
	) => void;
	onContentChange: (
		cellId: string,
		rowId: string,
		updatedMarkdown: string
	) => void;
	onAddTag: (
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		color: string,
		canAddMultiple: boolean
	) => void;
	onTagDeleteClick: (tagId: string) => void;
	onTagColorChange: (tagId: string, color: string) => void;
}

export default function Cell({
	cellId,
	columnId,
	rowId,
	markdown,
	columnType,
	rowCreationTime,
	rowLastEditedTime,
	tags,
	width,
	shouldWrapOverflow,
	hasAutoWidth,
	onRemoveTagClick,
	onTagColorChange,
	onTagDeleteClick,
	onTagClick,
	onContentChange,
	onAddTag,
}: Props) {
	const menu = useMenu(MenuLevel.ONE);
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu.id));
	const dispatch = useAppDispatch();
	const { isDarkMode } = useAppSelector((state) => state.global);

	//If we open a menu and then close it, we want to sort all rows
	//TODO optimize?
	useDidMountEffect(() => {
		if (!isOpen) {
			dispatch(updateSortTime());
		}
	}, [isOpen]);

	async function handleCellContextClick() {
		try {
			await navigator.clipboard.writeText(markdown);
			new Notice("Copied text to clipboard");
		} catch (err) {
			console.log(err);
		}
	}

	function handleCellClick(e: React.MouseEvent) {
		if (columnType === CellType.CHECKBOX) {
			const isChecked = isCheckboxChecked(markdown);

			if (isChecked) {
				handleCheckboxChange(CHECKBOX_MARKDOWN_UNCHECKED);
			} else {
				handleCheckboxChange(CHECKBOX_MARKDOWN_CHECKED);
			}
		} else if (
			columnType !== CellType.CREATION_TIME &&
			columnType !== CellType.LAST_EDITED_TIME
		) {
			const el = e.target as HTMLInputElement;

			//If we clicked on the link for a file or tag, return
			if (el.nodeName === "A") return;
			dispatch(
				openMenu({
					id: menu.id,
					level: menu.level,
				})
			);
		}
	}

	function handleAddTag(markdown: string, color: string) {
		onAddTag(
			cellId,
			columnId,
			rowId,
			markdown,
			color,
			columnType === CellType.MULTI_TAG
		);
	}

	function handleRemoveTagClick(tagId: string) {
		onRemoveTagClick(cellId, rowId, tagId);
	}

	function handleTagClick(tagId: string) {
		onTagClick(cellId, rowId, tagId, columnType === CellType.MULTI_TAG);
	}

	function handleTextInputChange(updatedMarkdown: string) {
		onContentChange(cellId, rowId, updatedMarkdown);
	}

	function handleNumberInputChange(updatedMarkdown: string) {
		onContentChange(cellId, rowId, updatedMarkdown);
	}

	function handleDateChange(updatedMarkdown: string) {
		onContentChange(cellId, rowId, updatedMarkdown);
	}

	function handleCheckboxChange(updatedMarkdown: string) {
		onContentChange(cellId, rowId, updatedMarkdown);
	}

	const {
		width: measuredWidth,
		height: measuredHeight,
		top,
		left,
	} = menu.position;

	function findHeight() {
		if (columnType == CellType.TEXT || columnType == CellType.NUMBER)
			return measuredHeight;
		return measuredHeight + 2;
	}

	let className = "NLT__td-container";
	if (
		columnType === CellType.LAST_EDITED_TIME ||
		columnType === CellType.CREATION_TIME
	) {
		className += " NLT__default-cursor";
	}

	const currentTag = tags.find((t) => t.cellIds.find((c) => c === cellId));
	const filteredTags = tags.filter((t) => t.cellIds.find((c) => c == cellId));

	return (
		<div
			ref={menu.containerRef}
			onClick={handleCellClick}
			onContextMenu={handleCellContextClick}
			className={className}
			style={{
				width,
			}}
		>
			{isOpen && (
				<Menu
					id={menu.id}
					isOpen={isOpen}
					top={top}
					left={left}
					minWidth={
						columnType === CellType.MULTI_TAG ||
						columnType === CellType.TAG
							? 250
							: 0
					}
					width={measuredWidth}
					height={findHeight()}
				>
					{columnType === CellType.TEXT && (
						<TextCellEdit
							value={markdown}
							onInputChange={handleTextInputChange}
						/>
					)}
					{columnType === CellType.NUMBER && (
						<NumberCellEdit
							value={markdown}
							onInputChange={handleNumberInputChange}
						/>
					)}
					{(columnType === CellType.TAG ||
						columnType === CellType.MULTI_TAG) && (
						<TagCellEdit
							tags={tags}
							cellId={cellId}
							onTagColorChange={onTagColorChange}
							onAddTag={handleAddTag}
							onRemoveTag={handleRemoveTagClick}
							onTagClick={handleTagClick}
							onTagDeleteClick={onTagDeleteClick}
						/>
					)}
					{columnType === CellType.DATE && (
						<DateCellEdit
							value={markdown}
							onDateChange={handleDateChange}
						/>
					)}
				</Menu>
			)}
			{columnType === CellType.TEXT && (
				<TextCell
					markdown={markdown}
					shouldWrapOverflow={shouldWrapOverflow}
					hasAutoWidth={hasAutoWidth}
				/>
			)}
			{columnType === CellType.NUMBER && (
				<NumberCell
					value={markdown}
					shouldWrapOverflow={shouldWrapOverflow}
					hasAutoWidth={hasAutoWidth}
				/>
			)}
			{columnType === CellType.CHECKBOX && (
				<CheckboxCell
					value={markdown}
					onCheckboxChange={handleCheckboxChange}
				/>
			)}
			{columnType === CellType.DATE && <DateCell value={markdown} />}
			{columnType === CellType.CREATION_TIME && (
				<CreationTimeCell
					value={rowCreationTime}
					shouldWrapOverflow={shouldWrapOverflow}
					hasAutoWidth={hasAutoWidth}
				/>
			)}
			{columnType === CellType.LAST_EDITED_TIME && (
				<LastEditedTimeCell
					value={rowLastEditedTime}
					shouldWrapOverflow={shouldWrapOverflow}
					hasAutoWidth={hasAutoWidth}
				/>
			)}
			{columnType === CellType.TAG && currentTag && (
				<TagCell
					isDarkMode={isDarkMode}
					markdown={currentTag.markdown}
					color={currentTag.color}
					hasAutoWidth={hasAutoWidth}
					shouldWrapOverflow={shouldWrapOverflow}
				/>
			)}
			{columnType === CellType.MULTI_TAG && filteredTags.length !== 0 && (
				<MultiTagCell
					isDarkMode={isDarkMode}
					tags={filteredTags}
					hasAutoWidth={hasAutoWidth}
					shouldWrapOverflow={shouldWrapOverflow}
				/>
			)}
		</div>
	);
}
