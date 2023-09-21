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
import MenuTrigger from "src/react/shared/menu-trigger";
import FileCell from "../file-cell";
import FileCellEdit from "../file-cell-edit";
import EmbedCell from "../embed-cell";
import EmbedCellEdit from "../embed-cell-edit";

import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	NumberFormat,
	PaddingSize,
	Tag,
} from "src/shared/loom-state/types/loom-state";
import LastEditedTimeCell from "../last-edited-time-cell";
import CreationTimeCell from "../creation-time-cell";
import {
	CHECKBOX_MARKDOWN_CHECKED,
	CHECKBOX_MARKDOWN_UNCHECKED,
} from "src/shared/constants";
import { isCheckboxChecked } from "src/shared/match";
import { Color } from "src/shared/loom-state/types/loom-state";
import { useMenu } from "../../shared/menu/hooks";

import "./styles.css";

interface Props {
	isExternalLink: boolean;
	columnType: string;
	cellId: string;
	rowId: string;
	dateTime: number | null;
	dateFormat: DateFormat;
	numberPrefix: string;
	numberSuffix: string;
	numberSeparator: string;
	numberFormat: NumberFormat;
	currencyType: CurrencyType;
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
	onTagNameChange: (columnId: string, tagId: string, value: string) => void;
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
	onExternalLinkToggle: (
		cellId: string,
		rowId: string,
		value: boolean
	) => void;
}

export default function BodyCellContainer({
	cellId,
	columnId,
	rowId,
	isExternalLink,
	markdown,
	aspectRatio,
	numberFormat,
	verticalPadding,
	currencyType,
	horizontalPadding,
	dateFormat,
	dateTime,
	numberPrefix,
	numberSuffix,
	numberSeparator,
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
	onTagNameChange,
	onTagAdd,
	onExternalLinkToggle,
}: Props) {
	//All of these cells have local values
	const shouldRequestOnClose =
		columnType === CellType.TEXT ||
		columnType === CellType.EMBED ||
		columnType === CellType.NUMBER ||
		columnType === CellType.TAG ||
		columnType === CellType.MULTI_TAG ||
		columnType === CellType.DATE;

	const {
		menu,
		triggerRef,
		triggerPosition,
		closeRequest,
		isOpen,
		onOpen,
		onClose,
		onRequestClose,
	} = useMenu({
		shouldRequestOnClose,
	});

	async function handleCellContextClick() {
		try {
			await navigator.clipboard.writeText(markdown);
			new Notice("Copied text to clipboard");
		} catch (err) {
			console.error(err);
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

	function handleExternalLinkToggle(value: boolean) {
		onExternalLinkToggle(cellId, rowId, value);
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

	function handleTagNameChange(tagId: string, value: string) {
		onTagNameChange(columnId, tagId, value);
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

	let menuWidth = triggerPosition.width;
	if (
		columnType === CellType.TAG ||
		columnType === CellType.MULTI_TAG ||
		columnType === CellType.EMBED
	) {
		menuWidth = 250;
	} else if (columnType === CellType.FILE) {
		menuWidth = 275;
	} else if (columnType === CellType.DATE) {
		menuWidth = 175;
	}

	let menuHeight = triggerPosition.height;
	if (
		columnType === CellType.TAG ||
		columnType === CellType.MULTI_TAG ||
		columnType === CellType.DATE ||
		columnType === CellType.NUMBER ||
		columnType === CellType.FILE ||
		columnType === CellType.EMBED
	) {
		menuHeight = 0;
	}

	let className = "dataloom-cell--body__container";
	if (
		columnType === CellType.LAST_EDITED_TIME ||
		columnType === CellType.CREATION_TIME
	) {
		className += " dataloom-default-cursor";
	}

	const cellTags = columnTags.filter((tag) => cellTagIds.includes(tag.id));

	return (
		<>
			<MenuTrigger
				ref={triggerRef}
				menu={menu}
				isCell
				onClick={handleMenuTriggerClick}
				onEnterDown={handleMenuTriggerEnterDown}
				onBackspaceDown={handleMenuTriggerBackspaceDown}
				shouldOpenOnTrigger={
					columnType !== CellType.CHECKBOX &&
					columnType !== CellType.CREATION_TIME &&
					columnType !== CellType.LAST_EDITED_TIME
				}
				onOpen={onOpen}
			>
				<div
					onContextMenu={handleCellContextClick}
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
							isExternalLink={isExternalLink}
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
							currency={currencyType}
							format={numberFormat}
							prefix={numberPrefix}
							suffix={numberSuffix}
							separator={numberSeparator}
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
				id={menu.id}
				hideBorder={
					columnType === CellType.TEXT ||
					columnType === CellType.NUMBER
				}
				isOpen={isOpen}
				triggerPosition={triggerPosition}
				width={menuWidth}
				height={menuHeight}
				onRequestClose={onRequestClose}
				onClose={onClose}
			>
				{columnType === CellType.TEXT && (
					<TextCellEdit
						closeRequest={closeRequest}
						shouldWrapOverflow={shouldWrapOverflow}
						value={markdown}
						onChange={handleInputChange}
						onClose={onClose}
					/>
				)}
				{columnType === CellType.EMBED && (
					<EmbedCellEdit
						isExternalLink={isExternalLink}
						closeRequest={closeRequest}
						value={markdown}
						onChange={handleInputChange}
						onClose={onClose}
						onExternalLinkToggle={handleExternalLinkToggle}
					/>
				)}
				{columnType === CellType.FILE && (
					<FileCellEdit
						onChange={handleInputChange}
						onClose={onClose}
					/>
				)}
				{columnType === CellType.NUMBER && (
					<NumberCellEdit
						closeRequest={closeRequest}
						value={markdown}
						onChange={handleInputChange}
						onClose={onClose}
					/>
				)}
				{(columnType === CellType.TAG ||
					columnType === CellType.MULTI_TAG) && (
					<TagCellEdit
						isMulti={columnType === CellType.MULTI_TAG}
						closeRequest={closeRequest}
						columnTags={columnTags}
						cellTags={cellTags}
						onTagColorChange={handleTagColorChange}
						onTagAdd={handleTagAdd}
						onRemoveTag={handleRemoveTagClick}
						onTagClick={handleTagClick}
						onTagDelete={handleTagDeleteClick}
						onTagNameChange={handleTagNameChange}
						onClose={onClose}
					/>
				)}
				{columnType === CellType.DATE && (
					<DateCellEdit
						value={dateTime}
						closeRequest={closeRequest}
						dateFormat={dateFormat}
						onDateTimeChange={handleDateTimeChange}
						onDateFormatChange={handleDateFormatChange}
						onClose={onClose}
					/>
				)}
			</Menu>
		</>
	);
}
