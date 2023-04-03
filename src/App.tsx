import { useEffect, useState } from "react";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import EditableTh from "./components/EditableTh";
import OptionBar from "./components/OptionBar";
import Button from "./components/Button";

import { Cell, CellType } from "./services/tableState/types";
import { SortDir } from "./services/sort/types";
import { logFunc } from "./services/debug";
import { TableState } from "./services/tableState/types";
import { useAppDispatch, useAppSelector } from "./services/redux/hooks";

import {
	addExistingTag,
	addNewTag,
	removeTag,
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
import { sortRows } from "./services/sort/sort";

import "./app.css";
import { updateCell } from "./services/tableState/cell";
import { addRow, deleteRow } from "./services/tableState/row";
import { useDidMountEffect, useId } from "./services/hooks";
import { ColumnIdError } from "./services/tableState/error";

const FILE_NAME = "App";

interface Props {
	initialState: TableState;
	onSaveTableState: (tableState: TableState) => void;
}

export default function App({ initialState, onSaveTableState }: Props) {
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

	//Handles sync between live preview and reading mode
	// useEffect(() => {
	// 	let timer: any = null;

	// 	async function checkForSyncEvents() {
	// 		const {
	// 			tableId: tId,
	// 			viewModes,
	// 			eventType,
	// 		} = plugin.settings.viewModeSync;
	// 		if (tId) {
	// 			const mode = viewModes.find((v) => v === viewMode);
	// 			if (mode && tableId === tId) {
	// 				logFunc(shouldDebug, FILE_NAME, "checkForSyncEvents", {
	// 					tableId,
	// 					viewModes,
	// 					eventType,
	// 				});
	// 				if (eventType === "update-state") {
	// 					setTableState(plugin.settings.data[tableId]);
	// 				} else if (eventType === "sort-rows") {
	// 					handleSortRows();
	// 				}
	// 				const modeIndex = viewModes.indexOf(mode);
	// 				plugin.settings.viewModeSync.viewModes.splice(modeIndex, 1);
	// 				if (plugin.settings.viewModeSync.viewModes.length === 0)
	// 					plugin.settings.viewModeSync.tableId = null;
	// 				await plugin.saveSettings();
	// 			}
	// 		}
	// 	}

	// 	function viewModeSync() {
	// 		timer = setInterval(() => {
	// 			checkForSyncEvents();
	// 		}, 50);
	// 	}

	// 	viewModeSync();
	// 	return () => {
	// 		clearInterval(timer);
	// 	};
	// }, []);

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

	function handleTagClick(
		cellId: string,
		columnId: string,
		tagId: string,
		canAddMultiple: boolean
	) {
		logFunc(shouldDebug, FILE_NAME, "handleTagClick", {
			cellId,
			columnId,
			tagId,
			canAddMultiple,
		});
		setTableState((prevState) =>
			addExistingTag(prevState, cellId, columnId, tagId, canAddMultiple)
		);
	}

	function handleRemoveTagClick(
		cellId: string,
		columnId: string,
		tagId: string
	) {
		logFunc(shouldDebug, FILE_NAME, "handleRemoveTagClick", {
			cellId,
			columnId,
			tagId,
		});
		setTableState((prevState) =>
			removeTag(prevState, cellId, columnId, tagId)
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

	function handleChangeColor(columnId: string, tagId: string, color: string) {
		//TODO implement
		// setTableState((prevState) => {
		// 	const tags = [...prevState.settings.columns[columnId].tags];
		// 	const index = tags.findIndex((t) => t.id === tagId);
		// 	tags[index].color = color;
		// 	return {
		// 		...prevState,
		// 		settings: {
		// 			...prevState.settings,
		// 			columns: {
		// 				...prevState.settings.columns,
		// 				[columnId]: {
		// 					...prevState.settings.columns[columnId],
		// 					tags,
		// 				},
		// 			},
		// 		},
		// 	};
		// });
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

	const { rows, columns, cells } = tableState.model;

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
												onSortSelect={
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
					rows={rows
						.filter((_row, i) => i !== 0)
						.map((row) => {
							const rowCells: Cell[] = cells.filter(
								(cell: Cell) => cell.rowId === row.id
							);
							const { id: rowId, menuCellId } = row;
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
											tags,
										} = column;
										const { id: cellId, markdown } = cell;

										return {
											id: cellId,
											content: (
												<EditableTd
													key={cellId}
													cellId={cellId}
													tags={tags}
													columnId={cell.columnId}
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
													onTagClick={handleTagClick}
													onRemoveTagClick={
														handleRemoveTagClick
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
