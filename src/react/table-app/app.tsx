import Table from "./table";
import RowOptions from "./row-options";
import OptionBar from "./option-bar";
import CalculationCell from "./calculation-cell";
import BodyCell from "./body-cell";
import NewColumnButton from "./new-column-button";
import HeaderCell from "./header-cell";

import { useUUID } from "../../shared/hooks";
import { CellNotFoundError } from "../../shared/dashboard-state/dashboard-error";
import { useTableState } from "../../shared/dashboard-state/dashboard-state-context";
import { useFilterRules } from "src/shared/dashboard-state/use-filter-rules";
import { filterBodyRowsBySearch } from "src/shared/dashboard-state/filter-by-search";
import { useColumn } from "src/shared/dashboard-state/use-column";
import { useRow } from "src/shared/dashboard-state/use-row";
import { useCell } from "src/shared/dashboard-state/use-cell";
import { useTag } from "src/shared/dashboard-state/use-tag";
import { css } from "@emotion/react";
import { useMountState } from "src/react/table-app/mount-provider";
import { useMenuState } from "src/shared/menu/menu-context";
import { SortDir } from "src/shared/types";

import "./styles.css";
import React from "react";
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
import { useExportEvents } from "src/shared/dashboard-state/use-export-events";
import { useRowEvents } from "src/shared/dashboard-state/use-row-events";
import { useColumnEvents } from "src/shared/dashboard-state/use-column-events";
import { VirtuosoHandle } from "react-virtuoso";
import BottomBar from "./bottom-bar";

export default function App() {
	const { appId, isMarkdownView } = useMountState();
	const { topMenu, hasOpenMenu, requestCloseTopMenu } = useMenuState();
	const logger = useLogger();
	const {
		tableState,
		resizingColumnId,
		searchText,
		commandRedo,
		commandUndo,
		setTableState,
	} = useTableState();

	const tableRef = React.useRef<VirtuosoHandle | null>(null);

	useExportEvents(tableState);
	useRowEvents();
	useColumnEvents();

	const {
		handleRuleAddClick,
		handleRuleColumnChange,
		handleRuleDeleteClick,
		handleRuleFilterTypeChange,
		handleRuleTextChange,
		handleRuleToggle,
		handleRuleTagsChange,
		filterBodyRowsByRules,
	} = useFilterRules(setTableState);

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
		logger("TableApp handleClick");
		e.stopPropagation();
		if (hasOpenMenu()) {
			requestCloseTopMenu("click");
		} else {
			removeFocusVisibleClass();
		}
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		logger("TableApp handleKeyDown");
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
				".Dashboards__focusable"
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
				".Dashboards__focusable"
			);
			if (focusableEls.length === 0) return;

			//Prevent default scrolling of the table container
			e.preventDefault();

			const focusedEl = document.activeElement;

			let index = -1;
			if (focusedEl) index = Array.from(focusableEls).indexOf(focusedEl);

			const numVisibleColumns = tableState.model.columns.filter(
				(column) => column.isVisible
			).length;
			const numBodyRows = tableState.model.bodyRows.length;
			const numSortedColumns = tableState.model.columns.filter(
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

	const {
		headerRows,
		footerRows,
		columns,
		headerCells,
		bodyCells,
		footerCells,
		filterRules,
	} = tableState.model;

	let filteredBodyRows = filterBodyRowsByRules(tableState);
	filteredBodyRows = filterBodyRowsBySearch(
		tableState,
		filteredBodyRows,
		searchText
	);
	const visibleColumns = columns.filter((column) => column.isVisible);

	return (
		<div
			data-id={appId}
			className="Dashboards__app"
			css={css`
				display: flex;
				flex-direction: column;
				width: 100%;
				height: 100%;
				border-top: 1px solid var(--background-modifier-border);
				border-bottom: ${isMarkdownView
					? "1px solid var(--background-modifier-border)"
					: "unset"};
			`}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
		>
			<OptionBar
				headerCells={headerCells}
				columns={columns}
				filterRules={filterRules}
				onColumnToggle={handleColumnToggle}
				onSortRemoveClick={handleSortRemoveClick}
				onRuleAddClick={handleRuleAddClick}
				onRuleDeleteClick={handleRuleDeleteClick}
				onRuleFilterTypeChange={handleRuleFilterTypeChange}
				onRuleColumnChange={handleRuleColumnChange}
				onRuleTextChange={handleRuleTextChange}
				onRuleToggle={handleRuleToggle}
				onRuleTagsChange={handleRuleTagsChange}
			/>
			<Table
				ref={tableRef}
				headerRows={headerRows.map((row) => {
					return {
						id: row.id,
						cells: [
							{
								id: firstColumnId,
								columnId: firstColumnId,
								content: (
									<div
										css={css`
											width: 35px;
										`}
									/>
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
											<div
												className="Dashboards__footer-td-container"
												css={css`
													width: ${width};
												`}
											>
												<CalculationCell
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
													cellType={type}
													onTypeChange={
														handleCalculationTypeChange
													}
												/>
											</div>
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
			/>
		</div>
	);
}
