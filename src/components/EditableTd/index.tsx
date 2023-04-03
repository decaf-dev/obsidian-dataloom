import React from "react";
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
import MultiTagCell from "../MultiTagCell";
import Menu from "../Menu";

import { CellType, Tag } from "src/services/tableState/types";
import { useMenu, usePosition } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { openMenu, isMenuOpen } from "src/services/menu/menuSlice";

import LastEditedTimeCell from "../LastEditedTimeCell";
import CreationTimeCell from "../CreationTimeCell";
import {
	CHECKBOX_MARKDOWN_CHECKED,
	CHECKBOX_MARKDOWN_UNCHECKED,
} from "src/services/tableState/constants";
import { isCheckboxChecked } from "src/services/string/validators";

import "./styles.css";

interface Props {
	columnType: string;
	cellId: string;
	columnId: string;
	markdown: string;
	rowCreationTime: number;
	rowLastEditedTime: number;
	width: string;
	tags: Tag[];
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onTagClick: (
		cellId: string,
		tagId: string,
		canAddMultiple: boolean
	) => void;
	onContentChange: (cellId: string, updatedMarkdown: string) => void;
	onAddTag: (
		cellId: string,
		columnId: string,
		markdown: string,
		color: string,
		canAddMultiple: boolean
	) => void;
	onTagDeleteClick: (tagId: string) => void;
	onTagColorChange: (tagId: string, color: string) => void;
}

export default function EditableTd({
	cellId,
	columnId,
	markdown,
	columnType,
	rowCreationTime,
	rowLastEditedTime,
	tags,
	width,
	shouldWrapOverflow,
	useAutoWidth,
	onRemoveTagClick,
	onTagColorChange,
	onTagDeleteClick,
	onTagClick,
	onContentChange,
	onAddTag,
}: Props) {
	const menu = useMenu(MenuLevel.ONE, true);
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu));
	const dispatch = useAppDispatch();
	const { isDarkMode } = useAppSelector((state) => state.global);

	const { containerRef, position } = usePosition();

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
			dispatch(openMenu(menu));
		}
	}

	function handleAddTag(markdown: string, color: string) {
		onAddTag(
			cellId,
			columnId,
			markdown,
			color,
			columnType === CellType.MULTI_TAG
		);
	}

	function handleRemoveTagClick(tagId: string) {
		onRemoveTagClick(cellId, tagId);
	}

	function handleTagClick(tagId: string) {
		onTagClick(cellId, tagId, columnType === CellType.MULTI_TAG);
	}

	function handleTextInputChange(updatedMarkdown: string) {
		onContentChange(cellId, updatedMarkdown);
	}

	function handleNumberInputChange(updatedMarkdown: string) {
		onContentChange(cellId, updatedMarkdown);
	}

	function handleDateChange(updatedMarkdown: string) {
		onContentChange(cellId, updatedMarkdown);
	}

	function handleCheckboxChange(updatedMarkdown: string) {
		onContentChange(cellId, updatedMarkdown);
	}

	const {
		width: measuredWidth,
		height: measuredHeight,
		top,
		left,
	} = position;

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
			ref={containerRef}
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
							content={markdown}
							onInputChange={handleTextInputChange}
						/>
					)}
					{columnType === CellType.NUMBER && (
						<NumberCellEdit
							content={markdown}
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
							content={markdown}
							onDateChange={handleDateChange}
						/>
					)}
				</Menu>
			)}
			{columnType === CellType.TEXT && (
				<TextCell
					markdown={markdown}
					shouldWrapOverflow={shouldWrapOverflow}
					useAutoWidth={useAutoWidth}
				/>
			)}
			{columnType === CellType.NUMBER && (
				<NumberCell
					content={markdown}
					shouldWrapOverflow={shouldWrapOverflow}
					useAutoWidth={useAutoWidth}
				/>
			)}
			{columnType === CellType.CHECKBOX && (
				<CheckboxCell
					content={markdown}
					onCheckboxChange={handleCheckboxChange}
				/>
			)}
			{columnType === CellType.DATE && <DateCell content={markdown} />}
			{columnType === CellType.CREATION_TIME && (
				<CreationTimeCell
					time={rowCreationTime}
					shouldWrapOverflow={shouldWrapOverflow}
					useAutoWidth={useAutoWidth}
				/>
			)}
			{columnType === CellType.LAST_EDITED_TIME && (
				<LastEditedTimeCell
					time={rowLastEditedTime}
					shouldWrapOverflow={shouldWrapOverflow}
					useAutoWidth={useAutoWidth}
				/>
			)}
			{columnType === CellType.TAG && currentTag && (
				<TagCell
					isDarkMode={isDarkMode}
					markdown={currentTag.markdown}
					color={currentTag.color}
					useAutoWidth={useAutoWidth}
					shouldWrapOverflow={shouldWrapOverflow}
				/>
			)}
			{columnType === CellType.MULTI_TAG && filteredTags.length !== 0 && (
				<MultiTagCell
					isDarkMode={isDarkMode}
					tags={filteredTags}
					useAutoWidth={useAutoWidth}
					shouldWrapOverflow={shouldWrapOverflow}
				/>
			)}
		</div>
	);
}
