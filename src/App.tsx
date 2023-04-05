import { useEffect, useState } from "react";

import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import OptionBar from "./components/OptionBar";
import Button from "./components/Button";

import { CellType, CurrencyType, SortDir } from "./services/tableState/types";
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
	changeColumnType,
	deleteColumn,
	insertColumn,
	moveColumn,
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
import {
	dateTimeToString,
	stringToCurrencyString,
} from "./services/string/conversion";
import { updateSortTime } from "./services/redux/globalSlice";
import HeaderCell from "./components/HeaderCell";
import Cell from "./components/Cell";
import { Color } from "./services/color/types";

const FILE_NAME = "App";

interface Props {
	initialState: TableState;
	onSaveTableState: (tableState: TableState) => void;
}

export default function App({ initialState, onSaveTableState }: Props) {
	const { searchText, sortTime } = useAppSelector((state) => state.global);
	const [tableState, setTableState] = useState(initialState);

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

	function handleMoveColumnClick(columnId: string, moveRight: boolean) {
		logFunc(shouldDebug, FILE_NAME, "handleMoveColumnClick", {
			columnId,
			moveRight,
		});
		setTableState((prevState: TableState) =>
			moveColumn(prevState, columnId, moveRight)
		);
	}

	function handleInsertColumnClick(columnId: string, insertRight: boolean) {
		logFunc(shouldDebug, FILE_NAME, "handleInsertColumnClick", {
			columnId,
			insertRight,
		});
		setTableState((prevState) =>
			insertColumn(prevState, columnId, insertRight)
		);
	}

	function handleTagChangeColor(tagId: string, color: Color) {
		logFunc(shouldDebug, FILE_NAME, "handleTagChangeColor", {
			tagId,
			color,
		});
		setTableState((prevState) => updateTagColor(prevState, tagId, color));
	}

	function handleAutoWidthToggle(columnId: string, value: boolean) {
		logFunc(shouldDebug, FILE_NAME, "handleAutoWidthToggle", {
			columnId,
			value,
		});
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "hasAutoWidth", value)
		);
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
			}
			return false;
		});
		if (matchedCell !== undefined) return true;

		const creationTimeString = dateTimeToString(row.creationTime);
		if (creationTimeString.toLowerCase().includes(searchText.toLowerCase()))
			return true;

		const lastEditedTimeString = dateTimeToString(row.lastEditedTime);
		if (
			lastEditedTimeString
				.toLowerCase()
				.includes(searchText.toLowerCase())
		)
			return true;

		return false;
	});

	return (
		<div className="NLT__app">
			<OptionBar
				model={tableState.model}
				onSortRemoveClick={handleSortRemoveClick}
			/>
			<div className="NLT__table-wrapper">
				<Table
					headers={[
						{
							id: headerRowId,
							cells: [
								...columns.map((column, i) => {
									const {
										id: columnId,
										width,
										type,
										sortDir,
										shouldWrapOverflow,
										hasAutoWidth,
										currencyType,
									} = column;

									const cell = cells.find(
										(cell) =>
											cell.columnId === columnId &&
											cell.isHeader
									);
									if (!cell) throw new CellNotFoundError();

									const {
										id: cellId,
										markdown,
										rowId,
									} = cell;
									return {
										id: cellId,
										content: (
											<HeaderCell
												key={columnId}
												cellId={cellId}
												rowId={rowId}
												columnIndex={i}
												currencyType={currencyType}
												numColumns={columns.length}
												columnId={cell.columnId}
												width={
													hasAutoWidth
														? "unset"
														: width
												}
												shouldWrapOverflow={
													shouldWrapOverflow
												}
												hasAutoWidth={hasAutoWidth}
												markdown={markdown}
												type={type}
												sortDir={sortDir}
												onSortClick={
													handleHeaderSortSelect
												}
												onInsertColumnClick={
													handleInsertColumnClick
												}
												onMoveColumnClick={
													handleMoveColumnClick
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
												onAutoWidthToggle={
													handleAutoWidthToggle
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
									content: (
										<div style={{ paddingLeft: "10px" }}>
											<Button
												onClick={() =>
													handleAddColumn()
												}
											>
												New
											</Button>
										</div>
									),
								},
							],
						},
					]}
					rows={filteredRows
						.filter((_row, i) => i !== 0)
						.map((row) => {
							const rowCells = cells.filter(
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
											hasAutoWidth,
											shouldWrapOverflow,
											currencyType,
										} = column;
										const {
											id: cellId,
											markdown,
											columnId,
										} = cell;

										const filteredTags = tags.filter(
											(tag) => tag.columnId === column.id
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
													hasAutoWidth={hasAutoWidth}
													width={
														hasAutoWidth
															? "unset"
															: width
													}
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
												style={{ paddingLeft: "10px" }}
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
					footers={[
						{
							id: footerRowId,
							cells: [
								...columns.map((_column, i) => {
									const {
										width,
										hasAutoWidth,
										footerCellId,
									} = columns[i];
									if (i === 0) {
										return {
											id: footerCellId,
											content: (
												<div
													style={{
														paddingTop: "10px",
														width: hasAutoWidth
															? "max-content"
															: width,
													}}
												>
													<Button
														onClick={() =>
															handleAddRow()
														}
													>
														New
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
	);
}
