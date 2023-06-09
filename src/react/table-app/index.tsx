import Table from "./table";
import RowOptions from "./row-options";
import OptionBar from "./option-bar";
import FunctionCell from "./function-cell";
import BodyCell from "./body-cell";
import NewRowButton from "./new-row-button";
import NewColumnButton from "./new-column-button";
import HeaderCell from "./header-cell";

import { useUUID } from "../../shared/hooks";
import { CellNotFoundError } from "../../shared/table-state/table-error";
import TableStateProvider, {
	useTableState,
} from "../../shared/table-state/table-state-context";
import { useFilterRules } from "src/shared/table-state/use-filter-rules";
import { filterBodyRowsBySearch } from "src/shared/table-state/filter-by-search";
import { useColumn } from "src/shared/table-state/use-column";
import { useRow } from "src/shared/table-state/use-row";
import { useCell } from "src/shared/table-state/use-cell";
import { useTag } from "src/shared/table-state/use-tag";
import { css } from "@emotion/react";
import { useExportEvents } from "src/shared/export/hooks";
import MountProvider, { useMountState } from "src/shared/view-context";
import { Provider } from "react-redux";
import MenuProvider, { useMenuState } from "src/shared/menu/menu-context";
import DragProvider from "src/shared/dragging/drag-context";
import { SortDir, TableState } from "src/shared/types/types";
import { Store } from "@reduxjs/toolkit";
import { MarkdownView, WorkspaceLeaf } from "obsidian";

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

const TableApp = () => {
	const { appId, leaf } = useMountState();
	const { topMenu, hasOpenMenu } = useMenuState();
	const logger = useLogger();
	const {
		tableState,
		resizingColumnId,
		searchText,
		commandRedo,
		commandUndo,
		setTableState,
	} = useTableState();

	useExportEvents(tableState);

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
		handleColumnSortClick,
		handleColumnTypeClick,
		handleColumnWidthChange,
		handleSortRemoveClick,
		handleFunctionTypeChange,
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

			const focusableEls = layerEl.querySelectorAll(".NLT__focusable");
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

			const focusableEls = layerEl.querySelectorAll(".NLT__focusable");
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
	const isMarkdownView = leaf.view instanceof MarkdownView;

	return (
		<div
			data-id={appId}
			className="NLT__app"
			css={css`
				display: flex;
				flex-direction: column;
				width: 100%;
				height: 100%;
				padding: 10px 0px;
				border-top: 1px solid var(--background-modifier-border);
				border-bottom: ${isMarkdownView
					? "1px solid var(--background-modifier-border)"
					: "unset"};
			`}
			onKeyDown={handleKeyDown}
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
								if (!cell) throw new CellNotFoundError();

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
								if (!cell) throw new CellNotFoundError();
								const {
									id: cellId,
									markdown,
									dateTime,
									tagIds,
								} = cell;

								return {
									id: cellId,
									content: (
										<BodyCell
											key={cellId}
											cellId={cellId}
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
										functionType,
									} = column;
									const cell = footerCells.find(
										(cell) =>
											cell.rowId === row.id &&
											cell.columnId === column.id
									);
									if (!cell) throw new CellNotFoundError();
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
												className="NLT__footer-td-container"
												css={css`
													width: ${width};
												`}
											>
												<FunctionCell
													columnId={columnId}
													columnTags={tags}
													cellId={cellId}
													currencyType={currencyType}
													dateFormat={dateFormat}
													bodyCells={columnBodyCells}
													bodyRows={filteredBodyRows}
													functionType={functionType}
													cellType={type}
													onFunctionTypeChange={
														handleFunctionTypeChange
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
						cells: [
							{
								id: firstColumnId,
								content: <></>,
							},
							...visibleColumns.map((column, i) => {
								const cell = footerCells.find(
									(cell) =>
										cell.rowId === row.id &&
										cell.columnId === column.id
								);
								if (!cell) throw new CellNotFoundError();

								if (i === 0) {
									return {
										id: cell.id,
										content: (
											<div
												style={{ width: column.width }}
											>
												<NewRowButton
													onClick={handleNewRowClick}
												/>
											</div>
										),
									};
								}
								return {
									id: cell.id,
									content: <></>,
								};
							}),
							{
								id: lastColumnId,
								content: <></>,
							},
						],
					};
				})}
			/>
		</div>
	);
};

interface Props {
	appId: string;
	isEmbedded: boolean;
	leaf: WorkspaceLeaf;
	filePath: string;
	store: Store;
	tableState: TableState;
	onSaveState: (appId: string, state: TableState) => void;
}
export const NotionLikeTable = ({
	appId,
	isEmbedded,
	leaf,
	store,
	filePath,
	tableState,
	onSaveState,
}: Props) => {
	return (
		<MountProvider
			appId={appId}
			isEmbedded={isEmbedded}
			leaf={leaf}
			filePath={filePath}
		>
			<Provider store={store}>
				<TableStateProvider
					initialState={tableState}
					onSaveState={onSaveState}
				>
					<MenuProvider>
						<DragProvider>
							<TableApp />
						</DragProvider>
					</MenuProvider>
				</TableStateProvider>
			</Provider>
		</MountProvider>
	);
};
