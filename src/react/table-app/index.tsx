import React from "react";

import Table from "./table";
import RowOptions from "./row-options";
import OptionBar from "./option-bar";

import {
	CellType,
	CurrencyType,
	DateFormat,
	FunctionType,
	SortDir,
} from "../../shared/table-state/types";
import { TableState } from "../../shared/table-state/types";
import { useAppDispatch, useAppSelector } from "../../redux/global/hooks";

import {
	addCellToTag,
	addNewTag,
	deleteTag,
	removeCellFromTag,
	updateTagColor,
} from "../../shared/table-state/tag-state-operations";
import {
	addColumn,
	changeColumnType,
	deleteColumn,
	sortOnColumn,
	updateColumn,
} from "../../shared/table-state/column-state-operations";
import { sortRows } from "../../shared/table-state/sort-state-operations";

import {
	updateHeaderCell,
	updateBodyCell,
	updateFooterCell,
} from "../../shared/table-state/cell-state-operations";
import {
	addRow,
	deleteRow,
} from "../../shared/table-state/row-state-operations";
import { useDidMountEffect, useUUID } from "../../shared/hooks";
import {
	CellNotFoundError,
	ColumnIdError,
} from "../../shared/table-state/table-error";
import { stringToCurrencyString } from "../../shared/conversion";
import { updateSortTime } from "../../redux/global/global-slice";
import HeaderCell from "./header-cell";
import { Color } from "../../shared/types";
import { useTableState } from "../../shared/table-state/table-state-context";
import FunctionCell from "./function-cell";
import BodyCell from "./body-cell";
import NewRowButton from "./new-row-button";
import NewColumnButton from "./new-column-button";

import "./styles.css";
import {
	unixTimeToDateString,
	unixTimeToDateTimeString,
} from "src/shared/date/date-conversion";
import { WorkspaceLeaf } from "obsidian";
import {
	ADD_COLUMN_EVENT,
	ADD_ROW_EVENT,
	DELETE_COLUMN_EVENT,
	DELETE_ROW_EVENT,
} from "src/shared/events";
import { useLogger } from "src/shared/logger";
import { useFilterRules } from "src/shared/table-state/use-filter-rules";
import { filterBodyRowsBySearch } from "src/shared/table-state/filter-by-search";

interface Props {
	viewLeaf: WorkspaceLeaf;
	onSaveTableState: (tableState: TableState) => void;
}

export default function TableApp({ viewLeaf, onSaveTableState }: Props) {
	const { searchText, sortTime } = useAppSelector((state) => state.global);
	const { tableId, tableState, setTableState } = useTableState();

	const dispatch = useAppDispatch();
	const logFunc = useLogger();
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

	const lastColumnId = useUUID();

	/**
	 * Setup our event listeners
	 */
	React.useEffect(() => {
		this.app.workspace.on(ADD_COLUMN_EVENT, (leaf: WorkspaceLeaf) => {
			if (leaf === viewLeaf) {
				setTableState((prevState) => addColumn(prevState));
			}
		});

		this.app.workspace.on(DELETE_COLUMN_EVENT, (leaf: WorkspaceLeaf) => {
			if (leaf === viewLeaf) {
				setTableState((prevState) =>
					deleteColumn(prevState, { last: true })
				);
			}
		});

		this.app.workspace.on(ADD_ROW_EVENT, (leaf: WorkspaceLeaf) => {
			if (leaf === viewLeaf) {
				setTableState((prevState) => addRow(prevState));
			}
		});

		this.app.workspace.on(DELETE_ROW_EVENT, (leaf: WorkspaceLeaf) => {
			if (leaf === viewLeaf) {
				setTableState((prevState) =>
					deleteRow(prevState, { last: true })
				);
			}
		});
	}, []);

	//Once we have mounted, whenever the table state is updated
	//save it to disk
	useDidMountEffect(() => {
		onSaveTableState(tableState);
	}, [tableState]);

	React.useEffect(() => {
		if (sortTime !== 0) {
			setTableState((prevState) => sortRows(prevState));
		}
	}, [sortTime]);

	function handleNewColumnClick() {
		logFunc("handleNewColumnClick");
		setTableState((prevState) => addColumn(prevState));
	}

	function handleNewRowClick() {
		logFunc("handleNewRowClick");
		setTableState((prevState) => addRow(prevState));
		dispatch(updateSortTime());
	}

	function handleHeaderTypeClick(columnId: string, type: CellType) {
		logFunc("handleHeaderTypeClick", {
			columnId,
			type,
		});
		setTableState((prevState) =>
			changeColumnType(prevState, columnId, type)
		);
	}

	function handleHeaderSortSelect(columnId: string, sortDir: SortDir) {
		logFunc("handleHeaderSortSelect", {
			columnId,
			sortDir,
		});
		setTableState((prevState) =>
			sortOnColumn(prevState, columnId, sortDir)
		);
		dispatch(updateSortTime());
	}

	function handleHeaderCellContentChange(cellId: string, value: string) {
		logFunc("handleCellContentChange", {
			cellId,
			markdown: value,
		});

		setTableState((prevState) =>
			updateHeaderCell(prevState, cellId, "markdown", value)
		);
	}

	function handleBodyCellContentChange(
		cellId: string,
		rowId: string,
		value: string
	) {
		logFunc("handleCellContentChange", {
			cellId,
			rowId,
			markdown: value,
		});

		setTableState((prevState) =>
			updateBodyCell(prevState, cellId, rowId, "markdown", value)
		);
	}

	function handleCellDateTimeChange(
		cellId: string,
		rowId: string,
		value: number | null
	) {
		logFunc("handleCellContentChange", {
			cellId,
			rowId,
			dateTime: value,
		});

		setTableState((prevState) =>
			updateBodyCell(prevState, cellId, rowId, "dateTime", value)
		);
	}

	function handleFunctionTypeChange(
		cellId: string,
		functionType: FunctionType
	) {
		logFunc("handleFunctionTypeChange", {
			cellId,
			functionType,
		});

		setTableState((prevState) =>
			updateFooterCell(prevState, cellId, "functionType", functionType)
		);
	}

	function handleAddTag(
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		color: Color,
		canAddMultiple: boolean
	) {
		logFunc("handleAddTag", {
			cellId,
			columnId,
			rowId,
			markdown,
			color,
			canAddMultiple,
		});
		setTableState((prevState) =>
			addNewTag(
				prevState,
				cellId,
				columnId,
				rowId,
				markdown,
				color,
				canAddMultiple
			)
		);
	}

	function handleAddCellToTag(
		cellId: string,
		rowId: string,
		tagId: string,
		canAddMultiple: boolean
	) {
		logFunc("handleAddCellToTag", {
			cellId,
			rowId,
			tagId,
			canAddMultiple,
		});
		setTableState((prevState) =>
			addCellToTag(prevState, cellId, rowId, tagId, canAddMultiple)
		);
	}

	function handleRemoveCellFromTag(
		cellId: string,
		rowId: string,
		tagId: string
	) {
		logFunc("handleRemoveCellFromTag", {
			cellId,
			rowId,
			tagId,
		});
		setTableState((prevState) =>
			removeCellFromTag(prevState, cellId, rowId, tagId)
		);
	}

	function handleColumnToggle(columnId: string) {
		logFunc("handleColumnToggle", {
			columnId,
		});
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "isVisible")
		);
	}

	function handleTagDeleteClick(tagId: string) {
		logFunc("handleTagDeleteClick", {
			tagId,
		});
		setTableState((prevState) => deleteTag(prevState, tagId));
	}

	function handleHeaderDeleteClick(columnId: string) {
		logFunc("handleHeaderDeleteClick", {
			columnId,
		});

		setTableState((prevState) => deleteColumn(prevState, { id: columnId }));
	}

	function handleRowDeleteClick(rowId: string) {
		logFunc("handleRowDeleteClick", {
			rowId,
		});
		setTableState((prevState) => deleteRow(prevState, { id: rowId }));
	}

	function handleCurrencyChange(
		columnId: string,
		currencyType: CurrencyType
	) {
		logFunc("handleCurrencyChange", {
			columnId,
			currencyType,
		});
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "currencyType", currencyType)
		);
		dispatch(updateSortTime());
	}

	function handleDateFormatChange(columnId: string, dateFormat: DateFormat) {
		logFunc("handleDateFormatChange", {
			columnId,
			dateFormat,
		});
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "dateFormat", dateFormat)
		);
		dispatch(updateSortTime());
	}

	function handleSortRemoveClick(columnId: string) {
		logFunc("handleSortRemoveClick", {
			columnId,
		});
		setTableState((prevState) =>
			sortOnColumn(prevState, columnId, SortDir.NONE)
		);
		dispatch(updateSortTime());
	}

	function handleHeaderWidthChange(columnId: string, width: string) {
		logFunc("handleHeaderWidthChange", {
			columnId,
			width,
		});
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "width", width)
		);
	}

	function handleTagChangeColor(tagId: string, color: Color) {
		logFunc("handleTagChangeColor", {
			tagId,
			color,
		});
		setTableState((prevState) => updateTagColor(prevState, tagId, color));
	}

	function handleWrapContentToggle(columnId: string, value: boolean) {
		logFunc("handleWrapContentToggle", {
			columnId,
			value,
		});
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "shouldWrapOverflow", value)
		);
	}

	const {
		headerRows,
		bodyRows,
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
											onSortClick={handleHeaderSortSelect}
											onWidthChange={
												handleHeaderWidthChange
											}
											onDeleteClick={
												handleHeaderDeleteClick
											}
											onTypeSelect={handleHeaderTypeClick}
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
											onTagClick={handleAddCellToTag}
											onRemoveTagClick={
												handleRemoveCellFromTag
											}
											onContentChange={
												handleBodyCellContentChange
											}
											onTagColorChange={
												handleTagChangeColor
											}
											onTagDelete={handleTagDeleteClick}
											onDateTimeChange={
												handleCellDateTimeChange
											}
											onDateFormatChange={
												handleDateFormatChange
											}
											onTagAdd={handleAddTag}
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
