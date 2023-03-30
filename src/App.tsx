import { useEffect, useState } from "react";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import EditableTh from "./components/EditableTh";
import OptionBar from "./components/OptionBar";
import Button from "./components/Button";

import { CellType } from "./services/tableState/types";
import { SortDir } from "./services/sort/types";
import { logFunc } from "./services/debug";
import { TableState } from "./services/tableState/types";
import { useAppDispatch, useAppSelector } from "./services/redux/hooks";
import { updateMenuPosition } from "./services/menu/menuSlice";
import {
	addExistingTag,
	addNewTag,
	removeTag,
} from "./services/tableState/tag";
import {
	addColumn,
	changeColumnType,
	deleteColumn,
	moveColumn,
	sortOnColumn,
	updateColumn,
} from "./services/tableState/column";
import { sortRows } from "./services/sort/sort";

import "./app.css";
import { randomUUID } from "crypto";
import { updateCell } from "./services/tableState/cell";
import { addRow, deleteRow } from "./services/tableState/row";

const FILE_NAME = "App";

interface Props {
	initialState: TableState;
}

export default function App({ initialState }: Props) {
	const [state, setTableState] = useState(initialState);

	const [saveTime, setSaveTime] = useState({
		time: 0,
		shouldSaveModel: false,
	});

	const [sortTime, setSortTime] = useState(0);

	const { shouldDebug } = useAppSelector((state) => state.global);

	const dispatch = useAppDispatch();

	//We run the throttle save in a useEffect because we want the table model to update
	//with new changes before we save
	// useEffect(() => {
	// 	//If not mount
	// 	if (saveTime.time !== 0) {
	// 		throttleSave(saveTime.shouldSaveModel);
	// 	}
	// }, [saveTime]);

	// const throttleSave = _.throttle(async (shouldSaveModel: boolean) => {
	// 	const viewModesToUpdate: MarkdownViewModeType[] = [];
	// 	// if (plugin.isLivePreviewEnabled()) {
	// 	// 	viewModesToUpdate.push(
	// 	// 		viewMode === "source" ? "preview" : "source"
	// 	// 	);
	// 	// }
	// 	await serializeTable(
	// 		shouldSaveModel,
	// 		plugin,
	// 		state,
	// 		tableId,
	// 		viewModesToUpdate
	// 	);
	// 	//Make sure to update the menu positions, so that the menu will render properly
	// 	dispatch(updateMenuPosition());
	// }, 150);

	const handleSaveData = (shouldSaveModel: boolean) => {
		setSaveTime({ shouldSaveModel, time: Date.now() });
	};

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
			setTableState((prevState) => {
				return {
					...prevState,
					model: sortRows(prevState),
				};
			});
			handleSaveData(true);
		}
	}, [sortTime]);

	function handleSortRows() {
		setSortTime(Date.now());
	}

	function handleAddColumn() {
		if (shouldDebug) console.log("[App]: handleAddColumn called.");
		setTableState((prevState) => addColumn(prevState));
		handleSaveData(true);
	}

	function handleAddRow() {
		logFunc(shouldDebug, FILE_NAME, "handleAddRow");
		setTableState((prevState) => addRow(prevState));
		handleSaveData(true);
	}

	function handleHeaderTypeClick(columnId: string, type: CellType) {
		logFunc(shouldDebug, FILE_NAME, "handleHeaderTypeClick", {
			columnId,
			type,
		});
		setTableState((prevState) =>
			changeColumnType(prevState, columnId, type)
		);
		handleSaveData(false);
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
		handleSaveData(true);
	}

	function handleAddTag(
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		html: string,
		color: string,
		canAddMultiple: boolean
	) {
		logFunc(shouldDebug, FILE_NAME, "handleAddTag", {
			cellId,
			columnId,
			rowId,
			markdown,
			html,
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
				html,
				color,
				canAddMultiple
			)
		);
		handleSaveData(true);
	}

	function handleTagClick(
		cellId: string,
		columnId: string,
		rowId: string,
		tagId: string,
		canAddMultiple: boolean
	) {
		logFunc(shouldDebug, FILE_NAME, "handleTagClick", {
			cellId,
			columnId,
			rowId,
			tagId,
			canAddMultiple,
		});
		setTableState((prevState) =>
			addExistingTag(
				prevState,
				cellId,
				columnId,
				rowId,
				tagId,
				canAddMultiple
			)
		);
		handleSaveData(true);
	}

	function handleRemoveTagClick(
		cellId: string,
		columnId: string,
		rowId: string,
		tagId: string
	) {
		logFunc(shouldDebug, FILE_NAME, "handleRemoveTagClick", {
			cellId,
			columnId,
			rowId,
			tagId,
		});
		setTableState((prevState) =>
			removeTag(prevState, cellId, columnId, rowId, tagId)
		);
		handleSaveData(true);
	}

	function handleHeaderDeleteClick(columnId: string) {
		logFunc(shouldDebug, FILE_NAME, "handleHeaderDeleteClick", {
			columnId,
		});

		setTableState((prevState) => deleteColumn(prevState, columnId));
		handleSaveData(true);
	}

	function handleRowDeleteClick(rowId: string) {
		logFunc(shouldDebug, FILE_NAME, "handleRowDeleteClick", {
			rowId,
		});
		setTableState((prevState) => deleteRow(prevState, rowId));
		handleSaveData(true);
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
		handleSaveData(false);
	}

	function handleMoveColumnClick(columnId: string, moveRight: boolean) {
		logFunc(shouldDebug, FILE_NAME, "handleMoveColumnClick", {
			columnId,
			moveRight,
		});
		setTableState((prevState: TableState) =>
			moveColumn(prevState, columnId, moveRight)
		);
		handleSaveData(true);
	}

	function handleInsertColumnClick(columnId: string, insertRight: boolean) {
		logFunc(shouldDebug, FILE_NAME, "handleInsertColumnClick", {
			columnId,
			insertRight,
		});
		//TODO implement
		// setTableState((prevState: TableState) => {
		// 	const { model, settings } = prevState;
		// 	const index = model.columnIds.indexOf(columnId);
		// 	const insertIndex = insertRight ? index + 1 : index;

		// 	const newColId = randomColumnId();
		// 	const updatedColumnIds = [...model.columnIds];
		// 	updatedColumnIds.splice(insertIndex, 0, newColId);

		// 	let updatedCells = [...model.cells];

		// 	for (let i = 0; i < model.rowIds.length; i++) {
		// 		updatedCells.push({
		// 			id: randomCellId(),
		// 			columnId: newColId,
		// 			rowId: model.rowIds[i],
		// 			markdown: i === 0 ? "New Column" : "",
		// 			html: i === 0 ? "New Column" : "",
		// 			isHeader: i === 0,
		// 		});
		// 	}

		// 	updatedCells = sortCells(
		// 		model.rowIds,
		// 		updatedColumnIds,
		// 		updatedCells
		// 	);

		// 	const settingsObj = { ...settings };
		// 	settingsObj.columns[newColId] = { ...DEFAULT_COLUMN_SETTINGS };

		// 	return {
		// 		...prevState,
		// 		model: {
		// 			...model,
		// 			columnIds: updatedColumnIds,
		// 			cells: updatedCells,
		// 		},
		// 		settings: settingsObj,
		// 	};
		// });
		handleSaveData(true);
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
		handleSaveData(false);
	}

	function handleAutoWidthToggle(columnId: string, value: boolean) {
		logFunc(shouldDebug, FILE_NAME, "handleAutoWidthToggle", {
			columnId,
			value,
		});
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "useAutoWidth", value)
		);

		handleSaveData(false);
	}

	function handleWrapContentToggle(columnId: string, value: boolean) {
		logFunc(shouldDebug, FILE_NAME, "handleWrapContentToggle", {
			columnId,
			value,
		});
		setTableState((prevState) =>
			updateColumn(prevState, columnId, "shouldWrapOverflow", value)
		);
		handleSaveData(false);
	}

	const { rows, columns, cells } = state.model;
	//const tableIdWithMode = getUniqueTableId(tableId, viewMode);

	return (
		<div
			// id={tableIdWithMode}
			// data-id={tableId}
			className="NLT__app"
			tabIndex={0}
		>
			<OptionBar
				model={state.model}
				onSortRemoveClick={handleSortRemoveClick}
			/>
			<div
				className="NLT__table-wrapper"
				onScroll={() => dispatch(updateMenuPosition())}
			>
				<Table
					headers={[
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
									cell.columnId === columnId && cell.isHeader
							);
							const { id: cellId, markdown, html } = cell;
							return {
								id: columnId,
								component: (
									<EditableTh
										key={columnId}
										cellId={cellId}
										columnIndex={i}
										numColumns={columns.length}
										columnId={cell.columnId}
										width={
											useAutoWidth ? "max-content" : width
										}
										shouldWrapOverflow={shouldWrapOverflow}
										useAutoWidth={useAutoWidth}
										markdown={markdown}
										html={html}
										type={type}
										sortDir={sortDir}
										onSortSelect={handleHeaderSortSelect}
										onInsertColumnClick={
											handleInsertColumnClick
										}
										onMoveColumnClick={
											handleMoveColumnClick
										}
										onWidthChange={handleHeaderWidthChange}
										onDeleteClick={handleHeaderDeleteClick}
										onTypeSelect={handleHeaderTypeClick}
										onAutoWidthToggle={
											handleAutoWidthToggle
										}
										onWrapOverflowToggle={
											handleWrapContentToggle
										}
										onNameChange={handleCellContentChange}
									/>
								),
							};
						}),
						{
							id: randomUUID(),
							component: (
								<th
									className="NLT__th"
									style={{ height: "1.8rem" }}
								>
									<div
										className="NLT__th-container"
										style={{ paddingLeft: "10px" }}
									>
										<Button
											onClick={() => handleAddColumn()}
										>
											New
										</Button>
									</div>
								</th>
							),
						},
					]}
					rows={rows
						.filter((_row, i) => i !== 0)
						.map((row) => {
							const rowCells = cells.filter(
								(cell) => cell.rowId === row.id
							);
							const { id: rowId } = row;
							return {
								id: rowId,
								component: (
									<>
										{rowCells.map((cell) => {
											const column = columns.find(
												(column) =>
													column.id == cell.columnId
											);
											const {
												width,
												type,
												useAutoWidth,
												shouldWrapOverflow,
												tags,
											} = column;
											const {
												id: cellId,
												markdown,
												html,
											} = cell;

											return (
												<EditableTd
													key={cellId}
													cellId={cellId}
													tags={tags}
													rowId={cell.rowId}
													columnId={cell.columnId}
													markdown={markdown}
													html={html}
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
											);
										})}
										<td className="NLT__td">
											<div className="NLT__td-container">
												<div className="NLT__td-cell-padding">
													<RowMenu
														rowId={rowId}
														onDeleteClick={
															handleRowDeleteClick
														}
													/>
												</div>
											</div>
										</td>
									</>
								),
							};
						})}
					footers={[0].map((_id) => {
						const { width, useAutoWidth } = columns[0];
						return {
							id: randomUUID(), //TODO change this is not efficient
							component: (
								<>
									<td className="NLT__td">
										<div
											className="NLT__td-container"
											style={{
												width: useAutoWidth
													? "max-content"
													: width,
											}}
										>
											<div className="NLT__td-cell-container NLT__td-cell-padding">
												<Button
													onClick={() =>
														handleAddRow()
													}
												>
													New
												</Button>
											</div>
										</div>
									</td>
									{columns.map((_column) => {
										<td className="NLT__td" />;
									})}
								</>
							),
						};
					})}
				/>
			</div>
		</div>
	);
}
