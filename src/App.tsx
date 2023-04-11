import { useEffect } from "react";

import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import OptionBar from "./components/OptionBar";
import Button from "./components/Button";

import {
	CellType,
	CurrencyType,
	DateFormat,
	SortDir,
} from "./services/tableState/types";
import { logFunc } from "./services/debug";
import { TableState } from "./services/tableState/types";
import { useAppDispatch, useAppSelector } from "./services/redux/hooks";

import {
	addCellToTag,
	addNewTag,
	deleteTag,
	removeCellFromTag,
	updateTagColor,
} from "./services/tableState/tag";
import {
	addColumn,
	changeColumnCurrencyType,
	changeColumnDateFormat,
	changeColumnType,
	deleteColumn,
	sortOnColumn,
	toggleColumn,
	updateColumn,
} from "./services/tableState/column";
import { sortRows } from "./services/tableState/sort";

import "./app.css";
import { updateCell } from "./services/tableState/cell";
import { addRow, deleteRow } from "./services/tableState/row";
import { useDidMountEffect } from "./services/hooks";
import { useId } from "./services/random/hooks";
import { CellNotFoundError, ColumnIdError } from "./services/tableState/error";
import { stringToCurrencyString } from "./services/string/conversion";
import { updateSortTime } from "./services/redux/globalSlice";
import HeaderCell from "./components/HeaderCell";
import Cell from "./components/Cell";
import { Color } from "./services/color/types";
import { useTableState } from "./services/tableState/useTableState";
import { unixTimeToString } from "./services/date";
import Icon from "./components/Icon";
import { IconType } from "./services/icon/types";

const FILE_NAME = "App";

interface Props {
	onSaveTableState: (tableState: TableState) => void;
}

export default function App({ onSaveTableState }: Props) {
	const { searchText, sortTime } = useAppSelector((state) => state.global);
	const [tableState, setTableState] = useTableState();

	const { shouldDebug } = useAppSelector((state) => state.global);
	const dispatch = useAppDispatch();

	const headerRowId = useId();
	const lastColumnId = useId();
	const footerRowId = useId();

	//Once we have mounted, whenever the table state is updated
	//save it to disk
	useDidMountEffect(() => {
		onSaveTableState(tableState);
	}, [tableState]);

	useEffect(() => {
		if (sortTime !== 0) {
			setTableState((prevState) => sortRows(prevState));
		}
	}, [sortTime]);

	function handleAddColumn() {
		logFunc(shouldDebug, FILE_NAME, "handleAddColumn");
		setTableState((prevState) => addColumn(prevState));
	}

	function handleAddRow() {
		logFunc(shouldDebug, FILE_NAME, "handleAddRow");
		setTableState((prevState) => addRow(prevState));
	}

	function handleHeaderTypeClick(columnId: string, type: CellType) {
		logFunc(shouldDebug, FILE_NAME, "handleHeaderTypeClick", {
			columnId,
			type,
		});
		setTableState((prevState) =>
			changeColumnType(prevState, columnId, type)
		);
	}

	function handleHeaderSortSelect(columnId: string, sortDir: SortDir) {
		logFunc(shouldDebug, FILE_NAME, "handleHeaderSortSelect", {
			columnId,
			sortDir,
		});
		setTableState((prevState) =>
			sortOnColumn(prevState, columnId, sortDir)
		);
		dispatch(updateSortTime());
	}

	function handleCellContentChange(
		cellId: string,
		rowId: string,
		updatedMarkdown: string
	) {
		logFunc(shouldDebug, FILE_NAME, "handleCellContentChange", {
			cellId,
			rowId,
			updatedMarkdown,
		});

		setTableState((prevState) =>
			updateCell(prevState, cellId, rowId, updatedMarkdown)
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
		logFunc(shouldDebug, FILE_NAME, "handleAddTag", {
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
		logFunc(shouldDebug, FILE_NAME, "handleAddCellToTag", {
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
		logFunc(shouldDebug, FILE_NAME, "handleRemoveCellFromTag", {
			cellId,
			rowId,
			tagId,
		});
		setTableState((prevState) =>
			removeCellFromTag(prevState, cellId, rowId, tagId)
		);
	}

	function handleColumnToggle(columnId: string) {
		logFunc(shouldDebug, FILE_NAME, "handleColumnToggle", {
			columnId,
		});
		setTableState((prevState) => toggleColumn(prevState, columnId));
	}

	function handleTagDeleteClick(tagId: string) {
		logFunc(shouldDebug, FILE_NAME, "handleTagDeleteClick", {
			tagId,
		});
		setTableState((prevState) => deleteTag(prevState, tagId));
	}

	function handleHeaderDeleteClick(columnId: string) {
		logFunc(shouldDebug, FILE_NAME, "handleHeaderDeleteClick", {
			columnId,
		});

		setTableState((prevState) => deleteColumn(prevState, columnId));
	}

	function handleRowDeleteClick(rowId: string) {
		logFunc(shouldDebug, FILE_NAME, "handleRowDeleteClick", {
			rowId,
		});
		setTableState((prevState) => deleteRow(prevState, rowId));
	}

	function handleCurrencyChange(
		columnId: string,
		currencyType: CurrencyType
	) {
		logFunc(shouldDebug, FILE_NAME, "handleCurrencyChange", {
			columnId,
			currencyType,
		});
		setTableState((prevState) =>
			changeColumnCurrencyType(prevState, columnId, currencyType)
		);
		dispatch(updateSortTime());
	}

	function handleDateFormatChange(columnId: string, dateFormat: DateFormat) {
		logFunc(shouldDebug, FILE_NAME, "handleDateFormatChange", {
			columnId,
			dateFormat,
		});
		setTableState((prevState) =>
			changeColumnDateFormat(prevState, columnId, dateFormat)
		);
		dispatch(updateSortTime());
	}

	function handleSortRemoveClick(columnId: string) {
		logFunc(shouldDebug, FILE_NAME, "handleSortRemoveClick", {
			columnId,
		});
		setTableState((prevState) =>
			sortOnColumn(prevState, columnId, SortDir.NONE)
		);
		dispatch(updateSortTime());
	}

	function handleHeaderWidthChange(columnId: string, width: string) {
		logFunc(shouldDebug, FILE_NAME, "handleHeaderWidthChange", {
			columnId,
			width,
		});
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "width", width)
		);
	}

	function handleTagChangeColor(tagId: string, color: Color) {
		logFunc(shouldDebug, FILE_NAME, "handleTagChangeColor", {
			tagId,
			color,
		});
		setTableState((prevState) => updateTagColor(prevState, tagId, color));
	}

	function handleWrapContentToggle(columnId: string, value: boolean) {
		logFunc(shouldDebug, FILE_NAME, "handleWrapContentToggle", {
			columnId,
			value,
		});
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "shouldWrapOverflow", value)
		);
	}

	const { rows, columns, cells, tags } = tableState.model;
	const columnCells = cells.map((cell) => {
		const column = columns.find((column) => column.id === cell.columnId);
		if (!column) throw new ColumnIdError(cell.columnId);
		return {
			...cell,
			column,
		};
	});

	const filteredRows = rows.filter((row) => {
		const filteredCells = columnCells.filter(
			(cell) => cell.rowId === row.id
		);
		const matchedCell = filteredCells.find((cell) => {
			if (cell.markdown.toLowerCase().includes(searchText.toLowerCase()))
				return true;
			if (cell.isHeader) return true;
			if (cell.column.type === CellType.CURRENCY) {
				const currencyString = stringToCurrencyString(
					cell.markdown,
					cell.column.currencyType
				);
				if (
					currencyString
						.toLowerCase()
						.includes(searchText.toLowerCase())
				)
					return true;
			} else if (
				cell.column.type === CellType.LAST_EDITED_TIME ||
				cell.column.type === CellType.CREATION_TIME
			) {
				const dateString = unixTimeToString(
					parseInt(cell.markdown),
					cell.column.dateFormat
				);
				if (dateString.toLowerCase().includes(searchText.toLowerCase()))
					return true;
			}
			return false;
		});
		if (matchedCell !== undefined) return true;

		return false;
	});

	const visibleColumns = columns.filter((column) => column.isVisible);
	const visibleCells = cells.filter((cell) =>
		visibleColumns.find((column) => column.id === cell.columnId)
	);

	return (
		<div className="NLT__app">
			<OptionBar
				cells={cells}
				columns={columns}
				onColumnToggle={handleColumnToggle}
				onSortRemoveClick={handleSortRemoveClick}
			/>
			<div className="NLT__table-outer">
				<div className="NLT__table-inner">
					<Table
						headerRows={[
							{
								id: headerRowId,
								cells: [
									...visibleColumns.map((column, i) => {
										const {
											id: columnId,
											width,
											type,
											sortDir,
											shouldWrapOverflow,
											currencyType,
											dateFormat,
										} = column;

										const cell = cells.find(
											(cell) =>
												cell.columnId === columnId &&
												cell.isHeader
										);
										if (!cell)
											throw new CellNotFoundError();

										const {
											id: cellId,
											markdown,
											rowId,
										} = cell;
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
													onSortClick={
														handleHeaderSortSelect
													}
													onWidthChange={
														handleHeaderWidthChange
													}
													onDeleteClick={
														handleHeaderDeleteClick
													}
													onTypeSelect={
														handleHeaderTypeClick
													}
													onDateFormatChange={
														handleDateFormatChange
													}
													onWrapOverflowToggle={
														handleWrapContentToggle
													}
													onNameChange={
														handleCellContentChange
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
											<div
												style={{
													paddingLeft: "10px",
												}}
											>
												<Button
													icon={
														<Icon
															type={IconType.ADD}
														/>
													}
													onClick={() =>
														handleAddColumn()
													}
												/>
											</div>
										),
									},
								],
							},
						]}
						bodyRows={filteredRows
							.filter((_row, i) => i !== 0)
							.map((row) => {
								const rowCells = visibleCells.filter(
									(cell) => cell.rowId === row.id
								);
								const {
									id: rowId,
									menuCellId,
									lastEditedTime,
									creationTime,
								} = row;
								return {
									id: rowId,
									cells: [
										...rowCells.map((cell) => {
											const column = columns.find(
												(column) =>
													column.id == cell.columnId
											);
											if (!column)
												throw new ColumnIdError(
													cell.columnId
												);
											const {
												width,
												type,
												shouldWrapOverflow,
												currencyType,
												dateFormat,
											} = column;
											const {
												id: cellId,
												markdown,
												columnId,
											} = cell;

											const filteredTags = tags.filter(
												(tag) =>
													tag.columnId === column.id
											);

											return {
												id: cellId,
												content: (
													<Cell
														key={cellId}
														cellId={cellId}
														rowId={rowId}
														tags={filteredTags}
														columnId={columnId}
														rowCreationTime={
															creationTime
														}
														dateFormat={dateFormat}
														columnCurrencyType={
															currencyType
														}
														rowLastEditedTime={
															lastEditedTime
														}
														markdown={markdown}
														columnType={type}
														shouldWrapOverflow={
															shouldWrapOverflow
														}
														width={width}
														onTagClick={
															handleAddCellToTag
														}
														onRemoveTagClick={
															handleRemoveCellFromTag
														}
														onContentChange={
															handleCellContentChange
														}
														onTagColorChange={
															handleTagChangeColor
														}
														onTagDeleteClick={
															handleTagDeleteClick
														}
														onAddTag={handleAddTag}
													/>
												),
											};
										}),
										{
											id: menuCellId,
											content: (
												<div
													style={{
														paddingLeft: "10px",
													}}
												>
													<RowMenu
														rowId={rowId}
														onDeleteClick={
															handleRowDeleteClick
														}
													/>
												</div>
											),
										},
									],
								};
							})}
						footerRows={[
							{
								id: footerRowId,
								cells: [
									...columns.map((_column, i) => {
										const { width, footerCellId } =
											columns[i];
										if (i === 0) {
											return {
												id: footerCellId,
												content: (
													<div
														style={{
															paddingTop: "10px",
															paddingLeft:
																"var(--size-4-4)",
															width,
														}}
													>
														<Button
															onClick={() =>
																handleAddRow()
															}
														>
															New row
														</Button>
													</div>
												),
											};
										}
										return {
											id: footerCellId,
											content: <></>,
										};
									}),
									{
										id: lastColumnId,
										content: <></>,
									},
								],
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}
