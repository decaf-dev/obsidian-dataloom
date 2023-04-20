import { useEffect } from "react";

import Table from "./components/Table";
import RowOptions from "./components/RowOptions";
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
	changeColumnType,
	deleteColumn,
	sortOnColumn,
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
import DateConversion from "./services/date/DateConversion";
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
		value: string
	) {
		logFunc(shouldDebug, FILE_NAME, "handleCellContentChange", {
			cellId,
			rowId,
			markdown: value,
		});

		setTableState((prevState) =>
			updateCell(prevState, cellId, rowId, "markdown", value)
		);
	}

	function handleCellDateTimeChange(
		cellId: string,
		rowId: string,
		value: number | null
	) {
		logFunc(shouldDebug, FILE_NAME, "handleCellContentChange", {
			cellId,
			rowId,
			dateTime: value,
		});

		setTableState((prevState) =>
			updateCell(prevState, cellId, rowId, "dateTime", value)
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
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "isVisible")
		);
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
			updateColumn(prevState, columnId, "currencyType", currencyType)
		);
		dispatch(updateSortTime());
	}

	function handleDateFormatChange(columnId: string, dateFormat: DateFormat) {
		logFunc(shouldDebug, FILE_NAME, "handleDateFormatChange", {
			columnId,
			dateFormat,
		});
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "dateFormat", dateFormat)
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

	const {
		headerRows,
		bodyRows,
		footerRows,
		columns,
		headerCells,
		bodyCells,
		footerCells,
		tags,
	} = tableState.model;
	const columnBodyCells = bodyCells.map((cell) => {
		const column = columns.find((column) => column.id === cell.columnId);
		if (!column) throw new ColumnIdError(cell.columnId);
		return {
			...cell,
			column,
		};
	});

	const filteredBodyRows = bodyRows.filter((row) => {
		const filteredCells = columnBodyCells.filter(
			(cell) => cell.rowId === row.id
		);
		const matchedCell = filteredCells.find((cell) => {
			const { dateTime, markdown } = cell;
			const { currencyType, type, dateFormat } = cell.column;
			const { lastEditedTime, creationTime } = row;

			if (markdown.toLowerCase().includes(searchText.toLowerCase()))
				return true;

			if (type === CellType.CURRENCY) {
				const currencyString = stringToCurrencyString(
					cell.markdown,
					currencyType
				);
				if (
					currencyString
						.toLowerCase()
						.includes(searchText.toLowerCase())
				)
					return true;
			} else if (type === CellType.LAST_EDITED_TIME) {
				const dateString = DateConversion.unixTimeToDateTimeString(
					lastEditedTime,
					dateFormat
				);
				if (dateString.toLowerCase().includes(searchText.toLowerCase()))
					return true;
			} else if (type === CellType.CREATION_TIME) {
				const dateString = DateConversion.unixTimeToDateTimeString(
					creationTime,
					dateFormat
				);
				if (dateString.toLowerCase().includes(searchText.toLowerCase()))
					return true;
			} else if (cell.column.type === CellType.DATE) {
				if (dateTime) {
					const dateString = DateConversion.unixTimeToDateString(
						dateTime,
						dateFormat
					);
					if (
						dateString
							.toLowerCase()
							.includes(searchText.toLowerCase())
					)
						return true;
				}
			}
			return false;
		});
		if (matchedCell !== undefined) return true;

		return false;
	});

	const visibleColumns = columns.filter((column) => column.isVisible);
	const visibleBodyCells = bodyCells.filter((cell) =>
		visibleColumns.find((column) => column.id === cell.columnId)
	);

	return (
		<div className="NLT__app">
			<OptionBar
				headerCells={headerCells}
				columns={columns}
				onColumnToggle={handleColumnToggle}
				onSortRemoveClick={handleSortRemoveClick}
			/>
			<div className="NLT__table-outer">
				<div className="NLT__table-inner">
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
													ariaLabel="Add column"
													onClick={() =>
														handleAddColumn()
													}
												/>
											</div>
										),
									},
								],
							};
						})}
						bodyRows={filteredBodyRows
							.filter((_row, i) => i !== 0)
							.map((row) => {
								const rowCells = visibleBodyCells.filter(
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
												dateTime,
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
														dateTime={dateTime}
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
														onDateTimeChange={
															handleCellDateTimeChange
														}
														onDateFormatChange={
															handleDateFormatChange
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
													<RowOptions
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
						footerRows={footerRows.map((row, i) => {
							if (i === 0) {
								return {
									id: row.id,
									cells: [
										...visibleColumns.map((column) => {
											const cell = footerCells.find(
												(cell) =>
													cell.rowId == row.id &&
													cell.columnId == column.id
											);
											if (!cell)
												throw new CellNotFoundError();
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
										if (!cell)
											throw new CellNotFoundError();
										const { width } = column;
										if (i === 0) {
											return {
												id: cell.id,
												content: (
													<div
														style={{
															paddingTop: "10px",
															paddingLeft: "10px",
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
			</div>
		</div>
	);
}
