import React from "react";
import { Notice } from "obsidian";

import TextCell from "../text-cell";
import TagCell from "../tag-cell";
import CheckboxCell from "../checkbox-cell";
import DateCell from "../date-cell";
import NumberCell from "../number-cell";
import NumberCellEdit from "../number-cell-edit";
import TextCellEdit from "../text-cell-edit";
import TagCellEdit from "../tag-cell-edit";
import DateCellEdit from "../date-cell-edit";
import MultiTagCell from "../multi-tag-cell";
import Menu from "../../shared/menu";

import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	PaddingSize,
	Tag,
} from "src/shared/types/types";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";

import LastEditedTimeCell from "../last-edited-time-cell";
import CreationTimeCell from "../creation-time-cell";
import {
	CHECKBOX_MARKDOWN_CHECKED,
	CHECKBOX_MARKDOWN_UNCHECKED,
} from "src/shared/table-state/constants";
import { isCheckboxChecked } from "src/shared/validators";

import { Color } from "src/shared/types/types";
import CurrencyCell from "../currency-cell";
import CurrencyCellEdit from "../currency-cell-edit";
import MenuTrigger from "src/react/shared/menu-trigger";

import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import FileCell from "../file-cell";
import FileCellEdit from "../file-cell-edit";
import { css } from "@emotion/react";
import EmbedCell from "../embed-cell";
import EmbedCellEdit from "../embed-cell-edit";

interface Props {
	columnType: string;
	cellId: string;
	rowId: string;
	dateTime: number | null;
	dateFormat: DateFormat;
	columnCurrencyType: CurrencyType;
	columnId: string;
	markdown: string;
	aspectRatio: AspectRatio;
	verticalPadding: PaddingSize;
	horizontalPadding: PaddingSize;
	rowCreationTime: number;
	rowLastEditedTime: number;
	width: string;
	columnTags: Tag[];
	cellTagIds: string[];
	shouldWrapOverflow: boolean;
	onTagRemoveClick: (cellId: string, rowId: string, tagId: string) => void;
	onTagMultipleRemove: (
		cellId: string,
		rowId: string,
		tagIds: string[]
	) => void;
	onTagClick: (
		cellId: string,
		rowId: string,
		tagId: string,
		isMultiTag: boolean
	) => void;
	onContentChange: (cellId: string, rowId: string, value: string) => void;
	onTagAdd: (
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		color: Color,
		isMultiTag: boolean
	) => void;
	onTagDelete: (columnId: string, tagId: string) => void;
	onTagColorChange: (columnId: string, tagId: string, color: Color) => void;
	onDateFormatChange: (columnId: string, value: DateFormat) => void;
	onDateTimeChange: (
		cellId: string,
		rowId: string,
		value: number | null
	) => void;
}

export default function BodyCell({
	cellId,
	columnId,
	rowId,
	markdown,
	aspectRatio,
	verticalPadding,
	horizontalPadding,
	dateFormat,
	dateTime,
	columnCurrencyType,
	columnType,
	rowCreationTime,
	rowLastEditedTime,
	columnTags,
	cellTagIds,
	width,
	shouldWrapOverflow,
	onTagRemoveClick,
	onTagMultipleRemove,
	onTagColorChange,
	onTagDelete,
	onTagClick,
	onContentChange,
	onDateFormatChange,
	onDateTimeChange,
	onTagAdd,
}: Props) {
	//All of these cells have local values
	const shouldRequestOnClose =
		columnType === CellType.TEXT ||
		columnType === CellType.EMBED ||
		columnType === CellType.NUMBER ||
		columnType === CellType.CURRENCY ||
		columnType === CellType.TAG ||
		columnType === CellType.MULTI_TAG ||
		columnType === CellType.DATE;

	const { menu, isMenuOpen, menuCloseRequest, menuRef, closeTopMenu } =
		useMenu(MenuLevel.ONE, {
			shouldRequestOnClose,
		});
	const { triggerPosition, triggerRef } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen);

	async function handleCellContextClick() {
		try {
			await navigator.clipboard.writeText(markdown);
			new Notice("Copied text to clipboard");
		} catch (err) {
			console.log(err);
		}
	}

	function toggleCheckbox() {
		const isChecked = isCheckboxChecked(markdown);

		if (isChecked) {
			handleCheckboxChange(CHECKBOX_MARKDOWN_UNCHECKED);
		} else {
			handleCheckboxChange(CHECKBOX_MARKDOWN_CHECKED);
		}
	}

	function handleMenuTriggerBackspaceDown() {
		if (
			columnType === CellType.TEXT ||
			columnType === CellType.EMBED ||
			columnType === CellType.NUMBER ||
			columnType === CellType.CURRENCY ||
			columnType === CellType.FILE
		) {
			onContentChange(cellId, rowId, "");
		} else if (columnType === CellType.DATE) {
			onDateTimeChange(cellId, rowId, null);
		} else if (columnType === CellType.CHECKBOX) {
			onContentChange(cellId, rowId, CHECKBOX_MARKDOWN_UNCHECKED);
		} else if (
			columnType === CellType.TAG ||
			columnType === CellType.MULTI_TAG
		) {
			onTagMultipleRemove(cellId, rowId, cellTagIds);
		}
	}

	function handleMenuTriggerEnterDown() {
		if (columnType === CellType.CHECKBOX) toggleCheckbox();
	}

	function handleMenuTriggerClick() {
		if (columnType === CellType.CHECKBOX) {
			toggleCheckbox();
		}
	}

	function handleTagAdd(markdown: string, color: Color) {
		if (markdown === "") return;
		onTagAdd(
			cellId,
			columnId,
			rowId,
			markdown.trim(),
			color,
			columnType === CellType.MULTI_TAG
		);
	}

	function handleRemoveTagClick(tagId: string) {
		onTagRemoveClick(cellId, rowId, tagId);
	}

	function handleTagColorChange(tagId: string, color: Color) {
		onTagColorChange(columnId, tagId, color);
	}

	function handleTagDeleteClick(tagId: string) {
		onTagDelete(columnId, tagId);
	}

	function handleTagClick(tagId: string) {
		onTagClick(cellId, rowId, tagId, columnType === CellType.MULTI_TAG);
	}

	const handleInputChange = React.useCallback(
		(value: string) => {
			onContentChange(cellId, rowId, value);
		},
		[cellId, rowId, onContentChange]
	);

	function handleCheckboxChange(value: string) {
		onContentChange(cellId, rowId, value);
	}

	function handleDateFormatChange(value: DateFormat) {
		onDateFormatChange(columnId, value);
	}

	const handleDateTimeChange = React.useCallback(
		(value: number | null) => {
			onDateTimeChange(cellId, rowId, value);
		},
		[cellId, rowId, onDateTimeChange]
	);

	const handleMenuClose = React.useCallback(() => {
		closeTopMenu();
	}, [closeTopMenu]);

	const { width: measuredWidth, height: measuredHeight } = triggerPosition;

	let menuHeight = measuredHeight;
	if (
		columnType === CellType.TAG ||
		columnType === CellType.MULTI_TAG ||
		columnType === CellType.DATE ||
		columnType === CellType.NUMBER ||
		columnType === CellType.CURRENCY ||
		columnType === CellType.FILE
	) {
		menuHeight = 0;
	}

	let menuWidth = measuredWidth;
	if (columnType === CellType.TAG || columnType === CellType.MULTI_TAG) {
		menuWidth = 250;
	} else if (columnType === CellType.FILE) {
		menuWidth = 275;
	} else if (columnType === CellType.DATE) {
		menuWidth = 175;
	}

	let className = "NLT__body-td-container";
	if (
		columnType === CellType.LAST_EDITED_TIME ||
		columnType === CellType.CREATION_TIME
	) {
		className += " NLT__default-cursor";
	}

	const cellTags = columnTags.filter((tag) => cellTagIds.includes(tag.id));

	return (
		<>
			<MenuTrigger
				isCell
				menu={menu}
				onClick={handleMenuTriggerClick}
				onEnterDown={handleMenuTriggerEnterDown}
				onBackspaceDown={handleMenuTriggerBackspaceDown}
				shouldRun={
					columnType !== CellType.CHECKBOX &&
					columnType !== CellType.CREATION_TIME &&
					columnType !== CellType.LAST_EDITED_TIME
				}
			>
				<div
					ref={triggerRef}
					onContextMenu={handleCellContextClick}
					css={css`
						display: flex;
						width: 100%;
						height: 100%;
						min-height: var(--nlt-cell-min-height);
						padding: var(--nlt-cell-spacing-x)
							var(--nlt-cell-spacing-y);
						cursor: pointer;
					`}
					className={className}
					style={{
						width,
					}}
				>
					{columnType === CellType.TEXT && (
						<TextCell
							markdown={markdown}
							shouldWrapOverflow={shouldWrapOverflow}
						/>
					)}
					{columnType === CellType.EMBED && (
						<EmbedCell
							markdown={markdown}
							verticalPadding={verticalPadding}
							horizontalPadding={horizontalPadding}
							aspectRatio={aspectRatio}
						/>
					)}
					{columnType === CellType.FILE && (
						<FileCell
							markdown={markdown}
							shouldWrapOverflow={shouldWrapOverflow}
						/>
					)}
					{columnType === CellType.NUMBER && (
						<NumberCell
							value={markdown}
							shouldWrapOverflow={shouldWrapOverflow}
						/>
					)}
					{columnType === CellType.CURRENCY && (
						<CurrencyCell
							value={markdown}
							currencyType={columnCurrencyType}
							shouldWrapOverflow={shouldWrapOverflow}
						/>
					)}
					{columnType === CellType.TAG && cellTags.length === 1 && (
						<TagCell
							markdown={cellTags[0].markdown}
							color={cellTags[0].color}
							shouldWrapOverflow={shouldWrapOverflow}
						/>
					)}
					{columnType === CellType.MULTI_TAG &&
						cellTags.length !== 0 && (
							<MultiTagCell
								cellTags={cellTags}
								shouldWrapOverflow={shouldWrapOverflow}
							/>
						)}
					{columnType === CellType.DATE && (
						<DateCell value={dateTime} format={dateFormat} />
					)}
					{columnType === CellType.CHECKBOX && (
						<CheckboxCell value={markdown} />
					)}
					{columnType === CellType.CREATION_TIME && (
						<CreationTimeCell
							value={rowCreationTime}
							format={dateFormat}
							shouldWrapOverflow={shouldWrapOverflow}
						/>
					)}
					{columnType === CellType.LAST_EDITED_TIME && (
						<LastEditedTimeCell
							value={rowLastEditedTime}
							format={dateFormat}
							shouldWrapOverflow={shouldWrapOverflow}
						/>
					)}
				</div>
			</MenuTrigger>
			<Menu
				ref={menuRef}
				id={menu.id}
				hideBorder={
					columnType === CellType.TEXT ||
					columnType === CellType.EMBED ||
					columnType === CellType.CURRENCY ||
					columnType === CellType.NUMBER
				}
				isOpen={isMenuOpen}
				top={triggerPosition.top}
				left={triggerPosition.left}
				width={menuWidth}
				height={menuHeight}
			>
				{columnType === CellType.TEXT && (
					<TextCellEdit
						menuCloseRequest={menuCloseRequest}
						shouldWrapOverflow={shouldWrapOverflow}
						value={markdown}
						onChange={handleInputChange}
						onMenuClose={handleMenuClose}
					/>
				)}
				{columnType === CellType.EMBED && (
					<EmbedCellEdit
						menuCloseRequest={menuCloseRequest}
						shouldWrapOverflow={shouldWrapOverflow}
						value={markdown}
						onChange={handleInputChange}
						onMenuClose={handleMenuClose}
					/>
				)}
				{columnType === CellType.FILE && (
					<FileCellEdit
						onChange={handleInputChange}
						onMenuClose={handleMenuClose}
					/>
				)}
				{columnType === CellType.NUMBER && (
					<NumberCellEdit
						menuCloseRequest={menuCloseRequest}
						value={markdown}
						onChange={handleInputChange}
						onMenuClose={handleMenuClose}
					/>
				)}
				{(columnType === CellType.TAG ||
					columnType === CellType.MULTI_TAG) && (
					<TagCellEdit
						menuCloseRequest={menuCloseRequest}
						columnTags={columnTags}
						cellTags={cellTags}
						onTagColorChange={handleTagColorChange}
						onTagAdd={handleTagAdd}
						onRemoveTag={handleRemoveTagClick}
						onTagClick={handleTagClick}
						onTagDelete={handleTagDeleteClick}
						onMenuClose={handleMenuClose}
					/>
				)}
				{columnType === CellType.DATE && (
					<DateCellEdit
						value={dateTime}
						menuCloseRequest={menuCloseRequest}
						dateFormat={dateFormat}
						onDateTimeChange={handleDateTimeChange}
						onDateFormatChange={handleDateFormatChange}
						onMenuClose={handleMenuClose}
					/>
				)}
				{columnType === CellType.CURRENCY && (
					<CurrencyCellEdit
						menuCloseRequest={menuCloseRequest}
						value={markdown}
						onChange={handleInputChange}
						onMenuClose={handleMenuClose}
					/>
				)}
			</Menu>
		</>
	);
}
