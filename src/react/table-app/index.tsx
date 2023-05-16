import React from "react";

import { WorkspaceLeaf } from "obsidian";

import Table from "./table";
import RowOptions from "./row-options";
import OptionBar from "./option-bar";
import FunctionCell from "./function-cell";
import BodyCell from "./body-cell";
import NewRowButton from "./new-row-button";
import NewColumnButton from "./new-column-button";
import HeaderCell from "./header-cell";

import { useAppSelector } from "../../redux/global/hooks";
import { sortRows } from "../../shared/table-state/sort-state-operations";
import { useUUID } from "../../shared/hooks";
import { CellNotFoundError } from "../../shared/table-state/table-error";
import { useTableState } from "../../shared/table-state/table-state-context";
import { useFilterRules } from "src/shared/table-state/use-filter-rules";
import { filterBodyRowsBySearch } from "src/shared/table-state/filter-by-search";
import { useColumn } from "src/shared/table-state/use-column";
import { useRow } from "src/shared/table-state/use-row";
import { useCell } from "src/shared/table-state/use-cell";
import { useTag } from "src/shared/table-state/use-tag";

import "./styles.css";

interface Props {
	viewLeaf: WorkspaceLeaf;
}

export default function TableApp({ viewLeaf }: Props) {
	const { searchText, sortTime } = useAppSelector((state) => state.global);
	const { tableId, tableState, setTableState } = useTableState();

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
		handleWrapContentToggle,
	} = useColumn(viewLeaf);

	const { handleNewRowClick, handleRowDeleteClick } = useRow(viewLeaf);

	const {
		handleBodyCellContentChange,
		handleCellDateTimeChange,
		handleFunctionTypeChange,
		handleHeaderCellContentChange,
	} = useCell();

	const {
		handleTagCellAdd,
		handleTagAdd,
		handleTagCellRemove,
		handleTagColorChange,
		handleTagDeleteClick,
	} = useTag();

	const lastColumnId = useUUID();

	React.useEffect(() => {
		if (sortTime !== 0) {
			setTableState((prevState) => sortRows(prevState));
		}
	}, [sortTime]);

	const {
		headerRows,
		footerRows,
		columns,
		headerCells,
		bodyCells,
		footerCells,
		tags,
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
		<div id={tableId} className="NLT__app">
			<OptionBar
				headerCells={headerCells}
				tags={tags}
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
							...visibleColumns.map((column) => {
								const {
									id: columnId,
									width,
									type,
									sortDir,
									shouldWrapOverflow,
									currencyType,
									dateFormat,
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
											numColumns={columns.length}
											columnId={cell.columnId}
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
					const {
						id: rowId,
						menuCellId,
						lastEditedTime,
						creationTime,
					} = row;
					return {
						id: rowId,
						cells: [
							...visibleColumns.map((column) => {
								const {
									id: columnId,
									width,
									type,
									shouldWrapOverflow,
									currencyType,
									dateFormat,
								} = column;

								const cell = bodyCells.find(
									(cell) =>
										cell.columnId === columnId &&
										cell.rowId === row.id
								);
								if (!cell) throw new CellNotFoundError();
								const { id: cellId, markdown, dateTime } = cell;

								const filteredTags = tags.filter(
									(tag) => tag.columnId === column.id
								);

								return {
									id: cellId,
									content: (
										<BodyCell
											key={cellId}
											cellId={cellId}
											rowId={rowId}
											tags={filteredTags}
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
											onRemoveTagClick={
												handleTagCellRemove
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
								id: menuCellId,
								content: (
									<RowOptions
										rowId={rowId}
										onDeleteClick={handleRowDeleteClick}
									/>
								),
							},
						],
					};
				})}
				footerRows={footerRows.map((row, i) => {
					if (i === 0) {
						return {
							id: row.id,
							cells: [
								...visibleColumns.map((column) => {
									const {
										id: columnId,
										type,
										currencyType,
										dateFormat,
										width,
									} = column;
									const cell = footerCells.find(
										(cell) =>
											cell.rowId == row.id &&
											cell.columnId == column.id
									);
									if (!cell) throw new CellNotFoundError();
									const { id: cellId, functionType } = cell;

									const filteredBodyCells = bodyCells.filter(
										(cell) =>
											filteredBodyRows.find(
												(row) => row.id === cell.rowId
											) !== undefined
									);

									return {
										id: cell.id,
										content: (
											<FunctionCell
												columnId={columnId}
												width={width}
												tags={tags}
												cellId={cellId}
												currencyType={currencyType}
												dateFormat={dateFormat}
												bodyCells={filteredBodyCells}
												bodyRows={filteredBodyRows}
												functionType={functionType}
												cellType={type}
												onFunctionTypeChange={
													handleFunctionTypeChange
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
						cells: [
							...visibleColumns.map((column, i) => {
								const cell = footerCells.find(
									(cell) =>
										cell.rowId == row.id &&
										cell.columnId == column.id
								);
								if (!cell) throw new CellNotFoundError();

								if (i === 0) {
									return {
										id: cell.id,
										content: (
											<NewRowButton
												onClick={handleNewRowClick}
											/>
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
}
