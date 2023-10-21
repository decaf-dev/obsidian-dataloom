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
import LastEditedTimeCell from "../last-edited-time-cell";
import CreationTimeCell from "../creation-time-cell";
import SourceFileCell from "../source-file-cell";
import SourceCell from "../source-cell";

import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	FrontmatterKey,
	NumberFormat,
	PaddingSize,
	Source,
	Tag,
} from "src/shared/loom-state/types/loom-state";
import {
	CHECKBOX_MARKDOWN_CHECKED,
	CHECKBOX_MARKDOWN_UNCHECKED,
} from "src/shared/constants";
import { isCheckboxChecked } from "src/shared/match";
import { Color } from "src/shared/loom-state/types/loom-state";
import { ColumnChangeHandler } from "../app/hooks/use-column/types";
import { CellChangeHandler } from "../app/hooks/use-cell/types";
import { TagChangeHandler } from "../app/hooks/use-tag/types";
import { LoomMenuLevel } from "src/react/shared/menu-provider/types";
import { useMenu } from "src/react/shared/menu-provider/hooks";

import "./styles.css";

interface Props {
	source: Source | null;
	isExternalLink: boolean;
	columnType: string;
	cellId: string;
	dateTime: number | null;
	frontmatterKey: FrontmatterKey | null;
	dateFormat: DateFormat;
	numberPrefix: string;
	numberSuffix: string;
	numberSeparator: string;
	numberFormat: NumberFormat;
	currencyType: CurrencyType;
	columnId: string;
	content: string;
	aspectRatio: AspectRatio;
	verticalPadding: PaddingSize;
	horizontalPadding: PaddingSize;
	rowCreationTime: number;
	rowLastEditedTime: number;
	width: string;
	columnTags: Tag[];
	cellTagIds: string[];
	shouldWrapOverflow: boolean;
	onTagRemoveClick: (cellId: string, tagId: string) => void;
	onTagMultipleRemove: (cellId: string, tagIds: string[]) => void;
	onTagClick: (cellId: string, tagId: string, isMultiTag: boolean) => void;
	onTagAdd: (
		cellId: string,
		columnId: string,
		markdown: string,
		color: Color,
		isMultiTag: boolean
	) => void;
	onTagDeleteClick: (columnId: string, tagId: string) => void;
	onColumnChange: ColumnChangeHandler;
	onCellChange: CellChangeHandler;
	onTagChange: TagChangeHandler;
}

export default function BodyCellContainer({
	cellId,
	columnId,
	isExternalLink,
	source,
	content,
	aspectRatio,
	numberFormat,
	verticalPadding,
	frontmatterKey,
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
	onTagDeleteClick,
	onTagClick,
	onColumnChange,
	onTagAdd,
	onTagChange,
	onCellChange,
}: Props) {
	//All of these cells have local values
	const shouldRequestOnClose =
		columnType === CellType.TEXT ||
		columnType === CellType.EMBED ||
		columnType === CellType.NUMBER ||
		columnType === CellType.TAG ||
		columnType === CellType.MULTI_TAG ||
		columnType === CellType.DATE;

	const COMPONENT_ID = `body-cell-${cellId}`;
	const menu = useMenu(COMPONENT_ID);

	async function handleCellContextClick() {
		try {
			await navigator.clipboard.writeText(content);
			new Notice("Copied text to clipboard");
		} catch (err) {
			console.error(err);
		}
	}

	function toggleCheckbox() {
		const isChecked = isCheckboxChecked(content);

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
			onCellChange(cellId, { content: "" });
		} else if (columnType === CellType.DATE) {
			onCellChange(cellId, { dateTime: null });
		} else if (columnType === CellType.CHECKBOX) {
			onCellChange(cellId, { content: CHECKBOX_MARKDOWN_UNCHECKED });
		} else if (
			columnType === CellType.TAG ||
			columnType === CellType.MULTI_TAG
		) {
			onTagMultipleRemove(cellId, cellTagIds);
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
		onCellChange(cellId, { isExternalLink: value });
	}

	function handleTagAdd(markdown: string, color: Color) {
		if (markdown === "") return;
		onTagAdd(
			cellId,
			columnId,
			markdown.trim(),
			color,
			columnType === CellType.MULTI_TAG
		);
	}

	function handleRemoveTagClick(tagId: string) {
		onTagRemoveClick(cellId, tagId);
	}

	function handleTagColorChange(tagId: string, value: Color) {
		onTagChange(columnId, tagId, { color: value });
	}

	function handleTagDeleteClick(tagId: string) {
		onTagDeleteClick(columnId, tagId);
	}

	function handleTagContentChange(tagId: string, value: string) {
		onTagChange(columnId, tagId, { content: value });
	}

	function handleTagClick(tagId: string) {
		onTagClick(cellId, tagId, columnType === CellType.MULTI_TAG);
	}

	const handleInputChange = React.useCallback(
		(value: string) => {
			onCellChange(cellId, { content: value });
		},
		[cellId, onCellChange]
	);

	function handleCheckboxChange(value: string) {
		onCellChange(cellId, { content: value });
	}

	function handleDateFormatChange(value: DateFormat) {
		onColumnChange(
			columnId,
			{ dateFormat: value },
			{ shouldSortRows: true }
		);
	}

	const handleDateTimeChange = React.useCallback(
		(value: number | null) => {
			onCellChange(cellId, { dateTime: value });
		},
		[cellId, onCellChange]
	);

	let menuWidth = menu.position.width;
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

	let menuHeight = menu.position.height;
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

	let className = "dataloom-cell__body-container";
	if (
		columnType === CellType.LAST_EDITED_TIME ||
		columnType === CellType.CREATION_TIME ||
		columnType === CellType.SOURCE ||
		columnType === CellType.SOURCE_FILE ||
		(source && frontmatterKey === null)
	) {
		className += " dataloom-cell__body-container--default-cursor";
	}

	const cellTags = columnTags.filter((tag) => cellTagIds.includes(tag.id));

	let shouldRunTrigger = true;
	if (
		columnType === CellType.CHECKBOX ||
		columnType === CellType.CREATION_TIME ||
		columnType === CellType.LAST_EDITED_TIME ||
		columnType === CellType.SOURCE ||
		columnType === CellType.SOURCE_FILE ||
		(source && frontmatterKey === null)
	) {
		shouldRunTrigger = false;
	}
	return (
		<>
			<MenuTrigger
				ref={menu.positionRef}
				variant="cell"
				level={LoomMenuLevel.ONE}
				onClick={handleMenuTriggerClick}
				onEnterDown={handleMenuTriggerEnterDown}
				onBackspaceDown={handleMenuTriggerBackspaceDown}
				shouldRunTrigger={shouldRunTrigger}
				onOpen={() =>
					menu.onOpen(LoomMenuLevel.ONE, {
						shouldRequestOnClose,
					})
				}
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
							value={content}
							shouldWrapOverflow={shouldWrapOverflow}
						/>
					)}
					{columnType === CellType.EMBED && (
						<EmbedCell
							isExternalLink={isExternalLink}
							value={content}
							verticalPadding={verticalPadding}
							horizontalPadding={horizontalPadding}
							aspectRatio={aspectRatio}
						/>
					)}
					{columnType === CellType.FILE && (
						<FileCell
							value={content}
							shouldWrapOverflow={shouldWrapOverflow}
						/>
					)}
					{columnType === CellType.SOURCE_FILE && (
						<SourceFileCell
							shouldWrapOverflow={shouldWrapOverflow}
							content={content}
						/>
					)}
					{columnType === CellType.NUMBER && (
						<NumberCell
							value={content}
							currency={currencyType}
							format={numberFormat}
							prefix={numberPrefix}
							suffix={numberSuffix}
							separator={numberSeparator}
						/>
					)}
					{columnType === CellType.TAG && cellTags.length === 1 && (
						<TagCell
							content={cellTags[0].content}
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
						<CheckboxCell value={content} />
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
					{columnType === CellType.SOURCE && (
						<SourceCell
							shouldWrapOverflow={shouldWrapOverflow}
							source={source}
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
				isOpen={menu.isOpen}
				position={menu.position}
				width={menuWidth}
				height={menuHeight}
			>
				{columnType === CellType.TEXT && (
					<TextCellEdit
						cellId={cellId}
						closeRequest={menu.closeRequest}
						shouldWrapOverflow={shouldWrapOverflow}
						value={content}
						onChange={handleInputChange}
						onClose={menu.onClose}
					/>
				)}
				{columnType === CellType.EMBED && (
					<EmbedCellEdit
						isExternalLink={isExternalLink}
						closeRequest={menu.closeRequest}
						value={content}
						onChange={handleInputChange}
						onClose={menu.onClose}
						onExternalLinkToggle={handleExternalLinkToggle}
					/>
				)}
				{columnType === CellType.FILE && (
					<FileCellEdit
						onChange={handleInputChange}
						onClose={menu.onClose}
					/>
				)}
				{columnType === CellType.NUMBER && (
					<NumberCellEdit
						closeRequest={menu.closeRequest}
						value={content}
						onChange={handleInputChange}
						onClose={menu.onClose}
					/>
				)}
				{(columnType === CellType.TAG ||
					columnType === CellType.MULTI_TAG) && (
					<TagCellEdit
						isMulti={columnType === CellType.MULTI_TAG}
						closeRequest={menu.closeRequest}
						columnTags={columnTags}
						cellTags={cellTags}
						onTagColorChange={handleTagColorChange}
						onTagAdd={handleTagAdd}
						onRemoveTag={handleRemoveTagClick}
						onTagClick={handleTagClick}
						onTagDelete={handleTagDeleteClick}
						onTagContentChange={handleTagContentChange}
						onClose={menu.onClose}
					/>
				)}
				{columnType === CellType.DATE && (
					<DateCellEdit
						cellId={cellId}
						value={dateTime}
						closeRequest={menu.closeRequest}
						dateFormat={dateFormat}
						onDateTimeChange={handleDateTimeChange}
						onDateFormatChange={handleDateFormatChange}
						onClose={menu.onClose}
					/>
				)}
			</Menu>
		</>
	);
}
