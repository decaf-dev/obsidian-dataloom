import React from "react";
import { Notice } from "obsidian";

import TextCell from "./components/TextCell";
import TagCell from "./components/TagCell";
import CheckboxCell from "./components/CheckboxCell";
import DateCell from "./components/DateCell";
import NumberCell from "./components/NumberCell";
import NumberCellEdit from "./components/NumberCellEdit";
import TextCellEdit from "./components/TextCellEdit";
import TagCellEdit from "./components/TagCellEdit";
import DateCellEdit from "./components/DateCellEdit";
import MultiTagCell from "./components/MultiTagCell";
import Menu from "../Menu";

import {
	CellType,
	CurrencyType,
	DateFormat,
	Tag,
} from "src/services/tableState/types";
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { closeTopLevelMenu, openMenu } from "src/services/menu/menuSlice";

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
import { Color } from "src/services/color/types";
import CurrencyCell from "./components/CurrencyCell";
import CurrencyCellEdit from "./components/CurrencyCellEdit";
import {
	getCloseMenuRequestTime,
	isMenuOpen,
	shiftMenuIntoViewContent,
} from "src/services/menu/utils";

interface Props {
	columnType: string;
	cellId: string;
	rowId: string;
	dateTime: number | null;
	dateFormat: DateFormat;
	columnCurrencyType: CurrencyType;
	columnId: string;
	markdown: string;
	rowCreationTime: number;
	rowLastEditedTime: number;
	width: string;
	tags: Tag[];
	shouldWrapOverflow: boolean;
	onRemoveTagClick: (cellId: string, rowId: string, tagId: string) => void;
	onTagClick: (
		cellId: string,
		rowId: string,
		tagId: string,
		canAddMultiple: boolean
	) => void;
	onContentChange: (cellId: string, rowId: string, value: string) => void;
	onAddTag: (
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		color: Color,
		canAddMultiple: boolean
	) => void;
	onTagDeleteClick: (tagId: string) => void;
	onTagColorChange: (tagId: string, color: Color) => void;
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
	dateFormat,
	dateTime,
	columnCurrencyType,
	columnType,
	rowCreationTime,
	rowLastEditedTime,
	tags,
	width,
	shouldWrapOverflow,
	onRemoveTagClick,
	onTagColorChange,
	onTagDeleteClick,
	onTagClick,
	onContentChange,
	onDateFormatChange,
	onDateTimeChange,
	onAddTag,
}: Props) {
	const { menu, menuPosition, isMenuOpen } = useMenu(
		MenuLevel.ONE,
		columnType === CellType.DATE
	);
	const closeMenuRequestTime = useAppSelector((state) =>
		getCloseMenuRequestTime(state, menu.id)
	);

	const dispatch = useAppDispatch();
	const { isDarkMode } = useAppSelector((state) => state.global);

	//If we open a menu and then close it, we want to sort all rows
	//TODO optimize?
	useDidMountEffect(() => {
		if (!isMenuOpen) {
			dispatch(updateSortTime());
		}
	}, [isMenuOpen]);

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

	function handleAddTag(markdown: string, color: Color) {
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

	function handleTextInputChange(value: string) {
		onContentChange(cellId, rowId, value);
	}

	function handleNumberInputChange(value: string) {
		onContentChange(cellId, rowId, value);
	}

	function handleDateChange(value: string) {
		onContentChange(cellId, rowId, value);
	}

	function handleCheckboxChange(value: string) {
		onContentChange(cellId, rowId, value);
	}

	function handleCurrencyChange(value: string) {
		onContentChange(cellId, rowId, value);
	}

	function handleDateFormatChange(value: DateFormat) {
		onDateFormatChange(columnId, value);
	}

	function handleDateTimeChange(value: number | null) {
		onDateTimeChange(cellId, rowId, value);
	}

	function handleMenuClose() {
		dispatch(closeTopLevelMenu());
	}

	const { top, left } = shiftMenuIntoViewContent(
		menu.id,
		menuPosition.positionRef.current,
		menuPosition.position,
		0,
		0
	);

	const { width: measuredWidth, height: measuredHeight } =
		menuPosition.position;

	let menuHeight = measuredHeight;
	if (
		columnType === CellType.TAG ||
		columnType === CellType.MULTI_TAG ||
		columnType === CellType.DATE
	) {
		menuHeight = 0;
	}

	let menuWidth = measuredWidth;
	if (columnType === CellType.TAG || columnType === CellType.MULTI_TAG) {
		menuWidth = 250;
	} else if (columnType == CellType.DATE) {
		menuWidth = 175;
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
			ref={menuPosition.positionRef}
			onClick={handleCellClick}
			onContextMenu={handleCellContextClick}
			className={className}
			style={{
				width,
			}}
		>
			<Menu
				id={menu.id}
				isOpen={isMenuOpen}
				top={top}
				left={left}
				width={menuWidth}
				height={menuHeight}
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
						value={dateTime}
						closeMenuRequestTime={closeMenuRequestTime}
						dateFormat={dateFormat}
						onDateTimeChange={handleDateTimeChange}
						onDateFormatChange={handleDateFormatChange}
						onMenuClose={handleMenuClose}
					/>
				)}
				{columnType === CellType.CURRENCY && (
					<CurrencyCellEdit
						value={markdown}
						onInputChange={handleCurrencyChange}
					/>
				)}
			</Menu>
			{columnType === CellType.TEXT && (
				<TextCell
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
			{columnType === CellType.TAG && currentTag && (
				<TagCell
					isDarkMode={isDarkMode}
					markdown={currentTag.markdown}
					color={currentTag.color}
					shouldWrapOverflow={shouldWrapOverflow}
				/>
			)}
			{columnType === CellType.MULTI_TAG && filteredTags.length !== 0 && (
				<MultiTagCell
					isDarkMode={isDarkMode}
					tags={filteredTags}
					shouldWrapOverflow={shouldWrapOverflow}
				/>
			)}
			{columnType === CellType.DATE && (
				<DateCell value={dateTime} format={dateFormat} />
			)}
			{columnType === CellType.CHECKBOX && (
				<CheckboxCell
					value={markdown}
					onCheckboxChange={handleCheckboxChange}
				/>
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
	);
}
