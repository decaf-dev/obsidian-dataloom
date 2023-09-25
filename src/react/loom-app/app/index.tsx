import React from "react";

import { VirtuosoHandle } from "react-virtuoso";

import Table from "../table";
import RowOptions from "../row-options";
import OptionBar from "../option-bar";
import HeaderCell from "../header-cell-container";
import BodyCell from "../body-cell-container";
import NewColumnButton from "../new-column-button";
import BottomBar from "../bottom-bar";

import { useUUID } from "../../../shared/hooks";
import CellNotFoundError from "src/shared/error/cell-not-found-error";
import { useLoomState } from "../loom-state-provider";
import { useFilter } from "./hooks/use-filter";
import { filterRowsBySearch } from "./filter-by-search";
import { useColumn } from "./hooks/use-column";
import { useRow } from "./hooks/use-row";
import { useCell } from "./hooks/use-cell";
import { useTag } from "./hooks/use-tag";
import { useAppMount } from "../app-mount-provider";
import { useExportEvents } from "src/react/loom-app/app/hooks/use-export-events";
import { useRowEvents } from "src/react/loom-app/app/hooks/use-row-events";
import { useColumnEvents } from "src/react/loom-app/app/hooks/use-column-events";
import { useTableSettings } from "./hooks/use-table-settings";
import useFocus from "./hooks/use-focus";
import { useMenuEvents } from "./hooks/use-menu-events";
import { nltEventSystem } from "src/shared/event-system/event-system";
import {
	isMacRedoDown,
	isMacUndoDown,
	isWindowsRedoDown,
	isWindowsUndoDown,
} from "src/shared/keyboard-event";

import "src/react/global.css";
import "./styles.css";
import { useLogger } from "src/shared/logger";
import { useMenuOperations } from "src/react/shared/menu/hooks";
import FooterCellContainer from "../footer-cell-container";
import { Cell } from "src/shared/loom-state/types/loom-state";

export default function App() {
	const logger = useLogger();
	const { reactAppId, isMarkdownView } = useAppMount();
	const { loomState, resizingColumnId, searchText, onRedo, onUndo } =
		useLoomState();

	const tableRef = React.useRef<VirtuosoHandle | null>(null);
	const { onRequestCloseTop } = useMenuOperations();

	useExportEvents(loomState);
	useRowEvents();
	useColumnEvents();
	useMenuEvents();

	const { onFocusKeyDown } = useFocus();
	const { onFrozenColumnsChange, onCalculationRowToggle } =
		useTableSettings();

	const { onFilterAdd, onFilterUpdate, onFilterDelete, filterByFilters } =
		useFilter();

	const {
		onColumnWidthChange,
		onColumnTypeClick,
		onColumnToggle,
		onColumnSortClick,
		onColumnHideClick,
		onColumnDeleteClick,
		onCalculationTypeChange,
		onNumberFormatChange,
		onNumberPrefixChange,
		onNumberSeparatorChange,
		onNumberSuffixChange,
		onAspectRatioClick,
		onWrapContentToggle,
		onVerticalPaddingClick,
		onSortRemoveClick,
		onColumnAddClick,
		onHorizontalPaddingClick,
		onDateFormatChange,
		onColumnContentChange,
	} = useColumn();

	const {
		onRowAddClick,
		onRowDeleteClick,
		onRowInsertAboveClick,
		onRowInsertBelowClick,
	} = useRow();

	const { onCellDateTimeChange, onCellContentChange, onExternalLinkToggle } =
		useCell();

	const {
		onTagCellAdd,
		onTagAdd,
		onTagCellRemove,
		onTagCellMultipleRemove,
		onTagColorChange,
		onTagDeleteClick,
		onTagContentChange,
	} = useTag();

	const firstColumnId = useUUID();
	const lastColumnId = useUUID();

	function handleScrollToTopClick() {
		tableRef.current?.scrollToIndex(0);
	}

	function handleScrollToBottomClick() {
		tableRef.current?.scrollToIndex(filteredBodyRows.length - 1);
	}

	function handleClick(e: React.MouseEvent) {
		logger("App handleClick");
		//Stop propagation to the global event
		e.stopPropagation();

		onRequestCloseTop();
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		logger("App handleKeyDown");
		//Stop propagation to the global event
		e.stopPropagation();
		if (isWindowsRedoDown(e) || isMacRedoDown(e)) {
			//Prevent Obsidian action bar from triggering
			e.preventDefault();
			onRedo();
		} else if (isWindowsUndoDown(e) || isMacUndoDown(e)) {
			//Prevent Obsidian action bar from triggering
			e.preventDefault();
			onUndo();
		} else {
			onFocusKeyDown(e);
		}
		nltEventSystem.dispatchEvent("keydown", e);
	}

	const { columns, filters, settings } = loomState.model;
	const { numFrozenColumns, showCalculationRow } = settings;

	let filteredBodyRows = filterByFilters(loomState);
	filteredBodyRows = filterRowsBySearch(
		loomState,
		filteredBodyRows,
		searchText
	);

	const visibleColumns = columns.filter((column) => column.isVisible);

	let className = "dataloom-app";
	if (isMarkdownView) className += " dataloom-app--markdown-view";
	return (
		<div
			id={reactAppId}
			className={className}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
		>
			<OptionBar
				columns={columns}
				filters={filters}
				numFrozenColumns={numFrozenColumns}
				showCalculationRow={showCalculationRow}
				onColumnToggle={onColumnToggle}
				onSortRemoveClick={onSortRemoveClick}
				onFilterAddClick={onFilterAdd}
				onFilterDeleteClick={onFilterDelete}
				onFilterUpdate={onFilterUpdate}
				onFrozenColumnsChange={onFrozenColumnsChange}
				onCalculationRowToggle={onCalculationRowToggle}
			/>
			<Table
				numFrozenColumns={numFrozenColumns}
				ref={tableRef}
				headerRow={{
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
								content,
								currencyType,
								numberFormat,
								numberPrefix,
								numberSeparator,
								numberSuffix,
								dateFormat,
								verticalPadding,
								horizontalPadding,
								aspectRatio,
							} = column;
							return {
								id: columnId,
								columnId,
								content: (
									<HeaderCell
										key={columnId}
										dateFormat={dateFormat}
										currencyType={currencyType}
										numberPrefix={numberPrefix}
										numberSeparator={numberSeparator}
										numberFormat={numberFormat}
										numberSuffix={numberSuffix}
										verticalPadding={verticalPadding}
										horizontalPadding={horizontalPadding}
										aspectRatio={aspectRatio}
										numColumns={columns.length}
										columnId={columnId}
										resizingColumnId={resizingColumnId}
										width={width}
										shouldWrapOverflow={shouldWrapOverflow}
										content={content}
										type={type}
										sortDir={sortDir}
										onSortClick={onColumnSortClick}
										onWidthChange={onColumnWidthChange}
										onDeleteClick={onColumnDeleteClick}
										onTypeSelect={onColumnTypeClick}
										onDateFormatChange={onDateFormatChange}
										onWrapOverflowToggle={
											onWrapContentToggle
										}
										onContentChange={onColumnContentChange}
										onNumberFormatChange={
											onNumberFormatChange
										}
										onNumberPrefixChange={
											onNumberPrefixChange
										}
										onNumberSeparatorChange={
											onNumberSeparatorChange
										}
										onNumberSuffixChange={
											onNumberSuffixChange
										}
										onVerticalPaddingClick={
											onVerticalPaddingClick
										}
										onHorizontalPaddingClick={
											onHorizontalPaddingClick
										}
										onAspectRatioClick={onAspectRatioClick}
										onHideClick={onColumnHideClick}
									/>
								),
							};
						}),
						{
							id: lastColumnId,
							columnId: lastColumnId,
							content: (
								<NewColumnButton onClick={onColumnAddClick} />
							),
						},
					],
				}}
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
										onDeleteClick={onRowDeleteClick}
										onInsertAboveClick={
											onRowInsertAboveClick
										}
										onInsertBelowClick={
											onRowInsertBelowClick
										}
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
									numberPrefix,
									numberSeparator,
									numberFormat,
									numberSuffix,
									dateFormat,
									tags,
									verticalPadding,
									horizontalPadding,
									aspectRatio,
								} = column;

								const cell = row.cells.find(
									(cell) => cell.columnId === columnId
								);
								if (!cell)
									throw new CellNotFoundError({
										columnId,
										rowId,
									});

								const {
									id: cellId,
									content,
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
											columnTags={tags}
											cellTagIds={tagIds}
											columnId={columnId}
											numberFormat={numberFormat}
											rowCreationTime={creationTime}
											dateFormat={dateFormat}
											currencyType={currencyType}
											numberPrefix={numberPrefix}
											numberSuffix={numberSuffix}
											numberSeparator={numberSeparator}
											rowLastEditedTime={lastEditedTime}
											dateTime={dateTime}
											content={content}
											columnType={type}
											shouldWrapOverflow={
												shouldWrapOverflow
											}
											width={width}
											onTagClick={onTagCellAdd}
											onTagRemoveClick={onTagCellRemove}
											onTagMultipleRemove={
												onTagCellMultipleRemove
											}
											onContentChange={
												onCellContentChange
											}
											onTagColorChange={onTagColorChange}
											onTagDelete={onTagDeleteClick}
											onDateTimeChange={
												onCellDateTimeChange
											}
											onDateFormatChange={
												onDateFormatChange
											}
											onTagAdd={onTagAdd}
											onExternalLinkToggle={
												onExternalLinkToggle
											}
											onTagContentChange={
												onTagContentChange
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
				footer={
					showCalculationRow
						? {
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
											numberFormat,
											width,
											tags,
											calculationType,
										} = column;

										const columnCells: Cell[] =
											filteredBodyRows.map((row) => {
												const cell = row.cells.find(
													(cell) =>
														cell.columnId ===
														columnId
												);
												if (!cell)
													throw new CellNotFoundError(
														{
															columnId,
															rowId: row.id,
														}
													);
												return cell;
											});

										return {
											id: columnId,
											content: (
												<FooterCellContainer
													columnId={columnId}
													columnTags={tags}
													numberFormat={numberFormat}
													currencyType={currencyType}
													dateFormat={dateFormat}
													columnCells={columnCells}
													rows={filteredBodyRows}
													calculationType={
														calculationType
													}
													width={width}
													cellType={type}
													onTypeChange={
														onCalculationTypeChange
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
						  }
						: undefined
				}
			/>
			<BottomBar
				onRowAddClick={onRowAddClick}
				onScrollToTopClick={handleScrollToTopClick}
				onScrollToBottomClick={handleScrollToBottomClick}
				onUndoClick={onUndo}
				onRedoClick={onRedo}
			/>
		</div>
	);
}
