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

import { CellType, Tag } from "src/services/table/types";
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import { usePositionRef } from "src/services/hooks";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { openMenu, isMenuOpen } from "src/services/menu/menuSlice";

import { DEBUG } from "../../constants";

import "./styles.css";
import MultiTagCell from "../MultiTagCell";

interface Props {
	columnType: string;
	cellId: string;
	rowId: string;
	columnId: string;
	markdown: string;
	html: string;
	width: string;
	height: string;
	tags: Tag[];
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	onRemoveTagClick: (
		cellId: string,
		columnId: string,
		rowId: string,
		tagId: string
	) => void;
	onTagClick: (
		cellId: string,
		columnId: string,
		rowId: string,
		tagId: string,
		canAddMultiple: boolean
	) => void;
	onContentChange: (cellId: string, updatedMarkdown: string) => void;
	onAddTag: (
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		html: string,
		color: string,
		canAddMultiple: boolean
	) => void;
	onColorChange: (columnId: string, tagId: string, color: string) => void;
}

export default function EditableTd({
	cellId,
	columnId,
	rowId,
	markdown,
	html,
	columnType,
	tags,
	width,
	height,
	shouldWrapOverflow,
	useAutoWidth,
	onRemoveTagClick,
	onColorChange,
	onTagClick,
	onContentChange,
	onAddTag,
}: Props) {
	const menu = useMenu(MenuLevel.ONE);
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu));
	const dispatch = useAppDispatch();
	const { isDarkMode } = useAppSelector((state) => state.global);

	const positionUpdateTime = useAppSelector(
		(state) => state.menu.positionUpdateTime
	);
	const { positionRef, position } = usePositionRef([
		positionUpdateTime,
		markdown.length,
	]);

	async function handleCellContextClick() {
		if (DEBUG.EDITABLE_TD)
			console.log("[EditableTd] handleCellContextClick()");
		try {
			await navigator.clipboard.writeText(markdown);
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

	function handleAddTag(markdown: string, html: string, color: string) {
		onAddTag(
			cellId,
			columnId,
			rowId,
			markdown,
			html,
			color,
			columnType === CellType.MULTI_TAG
		);
	}

	function handleRemoveTagClick(tagId: string) {
		onRemoveTagClick(cellId, columnId, rowId, tagId);
	}

	function handleColorChange(tagId: string, colorId: string) {
		onColorChange(columnId, tagId, colorId);
	}

	function handleTagClick(tagId: string) {
		onTagClick(
			cellId,
			columnId,
			rowId,
			tagId,
			columnType === CellType.MULTI_TAG
		);
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

	function renderCell(): React.ReactNode {
		switch (columnType) {
			case CellType.TEXT:
				return (
					<TextCell
						content={html}
						shouldWrapOverflow={shouldWrapOverflow}
						useAutoWidth={useAutoWidth}
					/>
				);
			case CellType.NUMBER:
				return (
					<NumberCell
						content={html}
						shouldWrapOverflow={shouldWrapOverflow}
						useAutoWidth={useAutoWidth}
					/>
				);
			case CellType.TAG: {
				const currentTag = tags.find((t) =>
					t.cells.find(
						(c) => c.rowId === rowId && c.columnId === columnId
					)
				);
				if (currentTag) {
					return (
						<TagCell
							isDarkMode={isDarkMode}
							html={currentTag.html}
							color={currentTag.color}
						/>
					);
				} else {
					return <></>;
				}
			}
			case CellType.MULTI_TAG: {
				const filteredTags = tags.filter((t) =>
					t.cells.find(
						(c) => c.rowId === rowId && c.columnId === columnId
					)
				);
				return <MultiTagCell tags={filteredTags} />;
			}
			case CellType.DATE:
				return <DateCell content={html} />;
			case CellType.CHECKBOX:
				return (
					<CheckboxCell
						content={html}
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
						content={markdown}
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
						content={markdown}
						onInputChange={handleNumberInputChange}
					/>
				);
			case CellType.TAG:
			case CellType.MULTI_TAG:
				return (
					<TagCellEdit
						tags={tags}
						rowId={rowId}
						columnId={columnId}
						menuId={menu.id}
						isOpen={isOpen}
						style={{
							top: position.top,
							left: position.left,
						}}
						onColorChange={handleColorChange}
						onAddTag={handleAddTag}
						onRemoveTag={handleRemoveTagClick}
						onTagClick={handleTagClick}
					/>
				);
			case CellType.DATE:
				return (
					<DateCellEdit
						menuId={menu.id}
						isOpen={isOpen}
						style={position}
						content={markdown}
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
				ref={positionRef}
				onClick={handleCellClick}
				onContextMenu={handleCellContextClick}
			>
				<div
					className="NLT__td-container"
					style={{
						width,
						height,
					}}
				>
					{renderCell()}
				</div>
			</td>
			{renderCellMenu()}
		</>
	);
}
