import { useEffect, useState } from "react";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import EditableTh from "./components/EditableTh";
import OptionBar from "./components/OptionBar";
import Button from "./components/Button";

import { Cell, CellType, SortDir } from "./services/tableState/types";
import { logFunc } from "./services/debug";
import { TableState } from "./services/tableState/types";
import { useAppDispatch, useAppSelector } from "./services/redux/hooks";

import {
	addCellToTag,
	addNewTag,
	removeCellFromTag,
	updateTagColor,
} from "./services/tableState/tag";
import {
	addColumn,
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
import { ColumnIdError } from "./services/tableState/error";
import { dateTimeToString } from "./services/string/conversion";

const FILE_NAME = "App";

interface Props {
	initialState: TableState;
	onSaveTableState: (tableState: TableState) => void;
}

export default function App({ initialState, onSaveTableState }: Props) {
	const { searchText } = useAppSelector((state) => state.global);
	const [tableState, setTableState] = useState(initialState);

	const [sortTime, setSortTime] = useState(0);

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

	function handleSortRows() {
		setSortTime(Date.now());
	}

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
		handleSortRows();
	}

	function handleCellContentChange(cellId: string, updatedMarkdown: string) {
		logFunc(shouldDebug, FILE_NAME, "handleCellContentChange", {
			cellId,
			updatedMarkdown,
		});

		setTableState((prevState) =>
			updateCell(prevState, cellId, updatedMarkdown)
		);
	}

	function handleAddTag(
		cellId: string,
		columnId: string,
		markdown: string,
		color: string,
		canAddMultiple: boolean
	) {
		logFunc(shouldDebug, FILE_NAME, "handleAddTag", {
			cellId,
			columnId,
			markdown,
			color,
			canAddMultiple,
		});
		setTableState((prevState) =>
			addNewTag(
				prevState,
				cellId,
				columnId,
				markdown,
				color,
				canAddMultiple
			)
		);
	}

	function handleAddCellToTag(
		cellId: string,
		tagId: string,
		canAddMultiple: boolean
	) {
		logFunc(shouldDebug, FILE_NAME, "handleAddCellToTag", {
			cellId,
			tagId,
			canAddMultiple,
		});
		setTableState((prevState) =>
			addCellToTag(prevState, cellId, tagId, canAddMultiple)
		);
	}

	function handleRemoveCellFromTag(cellId: string, tagId: string) {
		logFunc(shouldDebug, FILE_NAME, "handleRemoveCellFromTag", {
			cellId,
			tagId,
		});
		setTableState((prevState) =>
			removeCellFromTag(prevState, cellId, tagId)
		);
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

	function handleSortRemoveClick(columnId: string) {
		logFunc(shouldDebug, FILE_NAME, "handleSortRemoveClick", {
			columnId,
		});
		setTableState((prevState) =>
			sortOnColumn(prevState, columnId, SortDir.NONE)
		);
		handleSortRows();
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

	function handleChangeColor(tagId: string, color: string) {
		logFunc(shouldDebug, FILE_NAME, "handleChangeColor", {
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
			updateColumn(prevState, columnId, "useAutoWidth", value)
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
	const filteredRows = rows.filter((row) => {
		const filteredCells = cells.filter((cell) => cell.rowId === row.id);
		const matchedCell = filteredCells.find(
			(cell) =>
				cell.markdown
					.toLowerCase()
					.includes(searchText.toLowerCase()) || cell.isHeader
		);
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
										useAutoWidth,
									} = column;

									const cell = cells.find(
										(cell) =>
											cell.columnId === columnId &&
											cell.isHeader
									);
									if (!cell) throw Error("Cell not found");

									const { id: cellId, markdown } = cell;
									return {
										id: cellId,
										content: (
											<EditableTh
												key={columnId}
												cellId={cellId}
												columnIndex={i}
												numColumns={columns.length}
												columnId={cell.columnId}
												width={
													useAutoWidth
														? "max-content"
														: width
												}
												shouldWrapOverflow={
													shouldWrapOverflow
												}
												useAutoWidth={useAutoWidth}
												markdown={markdown}
												type={type}
												sortDir={sortDir}
												onSortClick={(sortDir) =>
													handleHeaderSortSelect(
														columnId,
														sortDir
													)
												}
												onInsertColumnClick={(
													insertRight
												) =>
													handleInsertColumnClick(
														columnId,
														insertRight
													)
												}
												onMoveColumnClick={(
													moveRight
												) =>
													handleMoveColumnClick(
														columnId,
														moveRight
													)
												}
												onWidthChange={(width) =>
													handleHeaderWidthChange(
														columnId,
														width
													)
												}
												onDeleteClick={() =>
													handleHeaderDeleteClick(
														columnId
													)
												}
												onTypeSelect={(type) =>
													handleHeaderTypeClick(
														columnId,
														type
													)
												}
												onAutoWidthToggle={(value) =>
													handleAutoWidthToggle(
														columnId,
														value
													)
												}
												onWrapOverflowToggle={(value) =>
													handleWrapContentToggle(
														columnId,
														value
													)
												}
												onNameChange={(value) =>
													handleCellContentChange(
														cellId,
														value
													)
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
							const rowCells: Cell[] = cells.filter(
								(cell: Cell) => cell.rowId === row.id
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
									...rowCells.map((cell: Cell) => {
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
											useAutoWidth,
											shouldWrapOverflow,
										} = column;
										const { id: cellId, markdown } = cell;

										const filteredTags = tags.filter(
											(tag) => tag.columnId === column.id
										);

										return {
											id: cellId,
											content: (
												<EditableTd
													key={cellId}
													cellId={cellId}
													tags={filteredTags}
													columnId={cell.columnId}
													rowCreationTime={
														creationTime
													}
													rowLastEditedTime={
														lastEditedTime
													}
													markdown={markdown}
													columnType={type}
													shouldWrapOverflow={
														shouldWrapOverflow
													}
													useAutoWidth={useAutoWidth}
													width={
														useAutoWidth
															? "max-content"
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
													onColorChange={
														handleChangeColor
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
										useAutoWidth,
										footerCellId,
									} = columns[i];
									if (i === 0) {
										return {
											id: footerCellId,
											content: (
												<div
													style={{
														paddingTop: "10px",
														width: useAutoWidth
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
