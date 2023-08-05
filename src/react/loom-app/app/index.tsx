import React from "react";

import { VirtuosoHandle } from "react-virtuoso";

import Table from "../table";
import RowOptions from "../row-options";
import OptionBar from "../option-bar";
import HeaderCell from "../header-cell-container";
import BodyCell from "../body-cell-container";
import FooterCell from "../footer-cell-container";
import NewColumnButton from "../new-column-button";
import BottomBar from "../bottom-bar";

import { useUUID } from "../../../shared/hooks";
import CellNotFoundError from "src/shared/error/cell-not-found-error";
import { useLoomState } from "../loom-state-provider";
import { useFilterRules } from "./use-filter-rules";
import { filterBodyRowsBySearch } from "./filter-by-search";
import { useColumn } from "./use-column";
import { useRow } from "./use-row";
import { useCell } from "./use-cell";
import { useTag } from "./use-tag";

import { useMountState } from "../mount-provider";
import { useMenuState } from "../menu-provider";
import { SortDir } from "src/shared/loom-state/types";

import {
	isMacRedoDown,
	isMacUndoDown,
	isWindowsRedoDown,
	isWindowsUndoDown,
} from "src/shared/keyboard-event";
import {
	focusNextElement,
	getFocusableLayerEl,
	removeFocusVisibleClass,
} from "src/shared/menu/focus-visible";
import { nltEventSystem } from "src/shared/event-system/event-system";
import { useLogger } from "src/shared/logger";
import {
	moveFocusDown,
	moveFocusLeft,
	moveFocusRight,
	moveFocusUp,
	moveMenuFocusDown,
	moveMenuFocusUp,
} from "src/shared/menu/arrow-move-focus";
import { useExportEvents } from "src/react/loom-app/app/use-export-events";
import { useRowEvents } from "src/react/loom-app/app/use-row-events";
import { useColumnEvents } from "src/react/loom-app/app/use-column-events";
import { useTableSettings } from "./use-table-settings";

import "./global-styles.css";
import "./styles.css";

export default function App() {
	const { appId, isMarkdownView } = useMountState();
	const { topMenu, hasOpenMenu, requestCloseTopMenu } = useMenuState();
	const logger = useLogger();
	const {
		loomState,
		resizingColumnId,
		searchText,
		commandRedo,
		commandUndo,
		setLoomState,
	} = useLoomState();

	const tableRef = React.useRef<VirtuosoHandle | null>(null);

	useExportEvents(loomState);
	useRowEvents();
	useColumnEvents();

	const { handleFrozenColumnsChange } = useTableSettings();

	const {
		handleRuleAddClick,
		handleRuleColumnChange,
		handleRuleDeleteClick,
		handleRuleFilterTypeChange,
		handleRuleTextChange,
		handleRuleToggle,
		handleRuleTagsChange,
		filterBodyRowsByRules,
	} = useFilterRules(setLoomState);

	const {
		handleNewColumnClick,
		handleColumnToggle,
		handleCurrencyChange,
		handleDateFormatChange,
		handleColumnDeleteClick,
		handleColumnHideClick,
		handleColumnSortClick,
		handleColumnTypeClick,
		handleColumnWidthChange,
		handleSortRemoveClick,
		handleCalculationTypeChange,
		handleWrapContentToggle,
		handleAspectRatioClick,
		handleHorizontalPaddingClick,
		handleVerticalPaddingClick,
	} = useColumn();

	const { handleNewRowClick, handleRowDeleteClick } = useRow();

	const {
		handleBodyCellContentChange,
		handleCellDateTimeChange,
		handleHeaderCellContentChange,
		handleExternalLinkToggle,
	} = useCell();

	const {
		handleTagCellAdd,
		handleTagAdd,
		handleTagCellRemove,
		handleTagCellMultipleRemove,
		handleTagColorChange,
		handleTagDeleteClick,
	} = useTag();

	const firstColumnId = useUUID();
	const lastColumnId = useUUID();

	function handleClick(e: React.MouseEvent) {
		logger("LoomApp handleClick");
		e.stopPropagation();
		if (hasOpenMenu()) {
			requestCloseTopMenu("click");
		} else {
			removeFocusVisibleClass();
		}
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		logger("LoomApp handleKeyDown");
		e.stopPropagation();

		if (e.key === "Tab") {
			//Remove any class that has focus
			removeFocusVisibleClass();

			//Prevent default tab behavior
			//which is to move focus to next element
			//We will do that ourselves
			e.preventDefault();

			const layerEl = getFocusableLayerEl(appId, topMenu);
			if (!layerEl) return;

			const focusableEls = layerEl.querySelectorAll(
				".dataloom-focusable"
			);
			if (focusableEls.length === 0) return;

			focusNextElement(layerEl, focusableEls);
		} else if (isWindowsRedoDown(e) || isMacRedoDown(e)) {
			//Prevent Obsidian action bar from triggering
			e.preventDefault();
			commandRedo();
		} else if (isWindowsUndoDown(e) || isMacUndoDown(e)) {
			//Prevent Obsidian action bar from triggering
			e.preventDefault();
			commandUndo();
		} else if (
			e.key === "ArrowDown" ||
			e.key === "ArrowUp" ||
			e.key === "ArrowLeft" ||
			e.key === "ArrowRight"
		) {
			const layerEl = getFocusableLayerEl(appId, topMenu);
			if (!layerEl) return;

			const focusableEls = layerEl.querySelectorAll(
				".dataloom-focusable"
			);
			if (focusableEls.length === 0) return;

			//Prevent default scrolling of the table container
			e.preventDefault();

			const focusedEl = document.activeElement;

			let index = -1;
			if (focusedEl) index = Array.from(focusableEls).indexOf(focusedEl);

			const numVisibleColumns = loomState.model.columns.filter(
				(column) => column.isVisible
			).length;
			const numBodyRows = loomState.model.bodyRows.length;
			const numSortedColumns = loomState.model.columns.filter(
				(column) => column.sortDir !== SortDir.NONE
			).length;

			let elementToFocus: Element | null = null;

			switch (e.key) {
				case "ArrowLeft":
					elementToFocus = moveFocusLeft(focusableEls, index);
					break;
				case "ArrowRight":
					elementToFocus = moveFocusRight(focusableEls, index);
					break;
				case "ArrowUp":
					if (hasOpenMenu()) {
						elementToFocus = moveMenuFocusUp(focusableEls, index);
					} else {
						elementToFocus = moveFocusUp(
							focusableEls,
							numVisibleColumns,
							numBodyRows,
							numSortedColumns,
							index
						);
					}
					break;
				case "ArrowDown":
					if (hasOpenMenu()) {
						elementToFocus = moveMenuFocusDown(focusableEls, index);
					} else {
						elementToFocus = moveFocusDown(
							focusableEls,
							numVisibleColumns,
							numBodyRows,
							numSortedColumns,
							index
						);
						break;
					}
			}
			if (elementToFocus !== null) {
				removeFocusVisibleClass();
				(elementToFocus as HTMLElement).focus();
			}
		}

		//Send the event to the event system
		//This is necessary to enabling scrolling with the arrow keys
		nltEventSystem.dispatchEvent("keydown", e);
	}

	function handleScrollToTopClick() {
		tableRef.current?.scrollToIndex(0);
	}

	function handleScrollToBottomClick() {
		tableRef.current?.scrollToIndex(filteredBodyRows.length - 1);
	}

	function handleRedoClick() {
		commandRedo();
	}

	function handleUndoClick() {
		commandUndo();
	}

	const {
		headerRows,
		footerRows,
		columns,
		headerCells,
		bodyCells,
		footerCells,
		filterRules,
		settings,
	} = loomState.model;
	const { numFrozenColumns } = settings;

	let filteredBodyRows = filterBodyRowsByRules(loomState);
	filteredBodyRows = filterBodyRowsBySearch(
		loomState,
		filteredBodyRows,
		searchText
	);
	const visibleColumns = columns.filter((column) => column.isVisible);

	let className = "dataloom-app";
	if (isMarkdownView) className += " dataloom-app--markdown-view";
	return (
		<div
			data-id={appId}
			className={className}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
		>
			<OptionBar
				headerCells={headerCells}
				columns={columns}
				filterRules={filterRules}
				numFrozenColumns={numFrozenColumns}
				onColumnToggle={handleColumnToggle}
				onSortRemoveClick={handleSortRemoveClick}
				onRuleAddClick={handleRuleAddClick}
				onRuleDeleteClick={handleRuleDeleteClick}
				onRuleFilterTypeChange={handleRuleFilterTypeChange}
				onRuleColumnChange={handleRuleColumnChange}
				onRuleTextChange={handleRuleTextChange}
				onRuleToggle={handleRuleToggle}
				onRuleTagsChange={handleRuleTagsChange}
				onFrozenColumnsChange={handleFrozenColumnsChange}
			/>
			<Table
				numFrozenColumns={numFrozenColumns}
				ref={tableRef}
				headerRows={headerRows.map((row) => {
					return {
						id: row.id,
						cells: [
							{
								id: firstColumnId,
								columnId: firstColumnId,
								content: (
									<div className="dataloom-cell--left-corner" />
								),
							},
							...visibleColumns.map((column) => {
								const {
									id: columnId,
									width,
									type,
									sortDir,
									shouldWrapOverflow,
									currencyType,
									dateFormat,
									verticalPadding,
									horizontalPadding,
									aspectRatio,
								} = column;

								const cell = headerCells.find(
									(cell) => cell.columnId === columnId
								);
								if (!cell)
									throw new CellNotFoundError({
										columnId,
									});

								const { id: cellId, markdown, rowId } = cell;
								return {
									id: cellId,
									columnId,
									content: (
										<HeaderCell
											key={columnId}
											cellId={cellId}
											rowId={rowId}
											dateFormat={dateFormat}
											currencyType={currencyType}
											verticalPadding={verticalPadding}
											horizontalPadding={
												horizontalPadding
											}
											aspectRatio={aspectRatio}
											numColumns={columns.length}
											columnId={cell.columnId}
											resizingColumnId={resizingColumnId}
											width={width}
											shouldWrapOverflow={
												shouldWrapOverflow
											}
											markdown={markdown}
											type={type}
											sortDir={sortDir}
											onSortClick={handleColumnSortClick}
											onWidthChange={
												handleColumnWidthChange
											}
											onDeleteClick={
												handleColumnDeleteClick
											}
											onTypeSelect={handleColumnTypeClick}
											onDateFormatChange={
												handleDateFormatChange
											}
											onWrapOverflowToggle={
												handleWrapContentToggle
											}
											onNameChange={
												handleHeaderCellContentChange
											}
											onCurrencyChange={
												handleCurrencyChange
											}
											onVerticalPaddingClick={
												handleVerticalPaddingClick
											}
											onHorizontalPaddingClick={
												handleHorizontalPaddingClick
											}
											onAspectRatioClick={
												handleAspectRatioClick
											}
											onHideClick={handleColumnHideClick}
										/>
									),
								};
							}),
							{
								id: lastColumnId,
								columnId: lastColumnId,
								content: (
									<NewColumnButton
										onClick={handleNewColumnClick}
									/>
								),
							},
						],
					};
				})}
				bodyRows={filteredBodyRows.map((row) => {
					const { id: rowId, lastEditedTime, creationTime } = row;
					return {
						id: rowId,
						cells: [
							{
								id: firstColumnId,
								content: (
									<RowOptions
										rowId={rowId}
										onDeleteClick={handleRowDeleteClick}
									/>
								),
							},
							...visibleColumns.map((column) => {
								const {
									id: columnId,
									width,
									type,
									shouldWrapOverflow,
									currencyType,
									dateFormat,
									tags,
									verticalPadding,
									horizontalPadding,
									aspectRatio,
								} = column;

								const cell = bodyCells.find(
									(cell) =>
										cell.columnId === columnId &&
										cell.rowId === row.id
								);
								if (!cell)
									throw new CellNotFoundError({
										columnId,
										rowId,
									});
								const {
									id: cellId,
									markdown,
									dateTime,
									tagIds,
									isExternalLink,
								} = cell;

								return {
									id: cellId,
									content: (
										<BodyCell
											key={cellId}
											cellId={cellId}
											isExternalLink={isExternalLink}
											verticalPadding={verticalPadding}
											horizontalPadding={
												horizontalPadding
											}
											aspectRatio={aspectRatio}
											rowId={rowId}
											columnTags={tags}
											cellTagIds={tagIds}
											columnId={columnId}
											rowCreationTime={creationTime}
											dateFormat={dateFormat}
											columnCurrencyType={currencyType}
											rowLastEditedTime={lastEditedTime}
											dateTime={dateTime}
											markdown={markdown}
											columnType={type}
											shouldWrapOverflow={
												shouldWrapOverflow
											}
											width={width}
											onTagClick={handleTagCellAdd}
											onTagRemoveClick={
												handleTagCellRemove
											}
											onTagMultipleRemove={
												handleTagCellMultipleRemove
											}
											onContentChange={
												handleBodyCellContentChange
											}
											onTagColorChange={
												handleTagColorChange
											}
											onTagDelete={handleTagDeleteClick}
											onDateTimeChange={
												handleCellDateTimeChange
											}
											onDateFormatChange={
												handleDateFormatChange
											}
											onTagAdd={handleTagAdd}
											onExternalLinkToggle={
												handleExternalLinkToggle
											}
										/>
									),
								};
							}),
							{
								id: lastColumnId,
								content: <></>,
							},
						],
					};
				})}
				footerRows={footerRows.map((row, i) => {
					if (i === 0) {
						return {
							id: row.id,
							cells: [
								{
									id: firstColumnId,
									content: <></>,
								},
								...visibleColumns.map((column) => {
									const {
										id: columnId,
										type,
										currencyType,
										dateFormat,
										width,
										tags,
										calculationType,
									} = column;
									const cell = footerCells.find(
										(cell) =>
											cell.rowId === row.id &&
											cell.columnId === column.id
									);
									if (!cell)
										throw new CellNotFoundError({
											rowId: row.id,
											columnId: column.id,
										});
									const { id: cellId } = cell;

									const columnBodyCells = bodyCells.filter(
										(cell) =>
											filteredBodyRows.find(
												(row) => row.id === cell.rowId
											) !== undefined
									);

									return {
										id: cell.id,
										content: (
											<FooterCell
												columnId={columnId}
												columnTags={tags}
												cellId={cellId}
												currencyType={currencyType}
												dateFormat={dateFormat}
												bodyCells={columnBodyCells}
												bodyRows={filteredBodyRows}
												calculationType={
													calculationType
												}
												width={width}
												cellType={type}
												onTypeChange={
													handleCalculationTypeChange
												}
											/>
										),
									};
								}),
								{
									id: lastColumnId,
									content: <></>,
								},
							],
						};
					}
					return {
						id: row.id,
						cells: [],
					};
				})}
			/>
			<BottomBar
				appId={appId}
				onNewRowClick={handleNewRowClick}
				onScrollToTopClick={handleScrollToTopClick}
				onScrollToBottomClick={handleScrollToBottomClick}
				onUndoClick={handleUndoClick}
				onRedoClick={handleRedoClick}
			/>
		</div>
	);
}
