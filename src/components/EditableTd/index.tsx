import React, { useEffect, useId, useRef, useState } from "react";
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
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { openMenu, isMenuOpen } from "src/services/menu/menuSlice";

import "./styles.css";
import { usePositionRef } from "src/services/hooks";

interface Props {
	columnType: string;
	cellId: string;
	rowId: string;
	columnId: string;
	markdown: string;
	html: string;
	width: string;
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
	shouldWrapOverflow,
	useAutoWidth,
	onRemoveTagClick,
	onColorChange,
	onTagClick,
	onContentChange,
	onAddTag,
}: Props) {
	const menu = useMenu(MenuLevel.ONE, true);
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu));
	const { positionUpdateTime } = useAppSelector((state) => state.menu);
	const dispatch = useAppDispatch();
	const { isDarkMode } = useAppSelector((state) => state.global);

	const { position, ref: positionRef } = usePositionRef([
		positionUpdateTime,
		markdown.length,
		shouldWrapOverflow,
		useAutoWidth,
		width,
	]);

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
			let isChecked = markdown.includes("x");

			if (isChecked) {
				handleCheckboxChange("[ ]");
			} else {
				handleCheckboxChange("[x]");
			}
		} else {
			const el = e.target as HTMLInputElement;

			//If we clicked on the link for a file or tag, return
			if (el.nodeName === "A") return;
			dispatch(openMenu(menu));
		}
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
				return (
					<MultiTagCell isDarkMode={isDarkMode} tags={filteredTags} />
				);
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

	const {
		width: measuredWidth,
		height: measuredHeight,
		top,
		left,
	} = position;

	function findHeight() {
		if (useAutoWidth || !shouldWrapOverflow) return 100;
		return measuredHeight + 2;
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
					}}
				>
					{isOpen && (
						<Menu
							id={menu.id}
							isOpen={isOpen}
							top={top - 2}
							left={left}
							minWidth={
								columnType === CellType.MULTI_TAG ||
								columnType === CellType.TAG
									? 250
									: 150
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
									rowId={rowId}
									columnId={columnId}
									onColorChange={handleColorChange}
									onAddTag={handleAddTag}
									onRemoveTag={handleRemoveTagClick}
									onTagClick={handleTagClick}
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
					<div className="NLT__td-cell-container NLT__td-cell-padding">
						{renderCell()}
					</div>
				</div>
			</td>
		</>
	);
}
