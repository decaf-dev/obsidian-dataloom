import React, { useEffect, useState } from "react";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import EditableTh from "./components/EditableTh";
import OptionBar from "./components/OptionBar";

import { Cell, CellType } from "./services/table/types";
import { serializeTable } from "./services/io/serialize";
import NltPlugin from "./main";
import { SortDir } from "./services/sort/types";
import { addRow } from "./services/table/row";
import { addColumn } from "./services/table/column";
import { logFunc } from "./services/debug";
import { DEFAULT_COLUMN_SETTINGS } from "./services/table/types";
import { getUniqueTableId, sortCells } from "./services/table/utils";
import { TableState } from "./services/table/types";

import { DEBUG } from "./constants";

import { MarkdownViewModeType } from "obsidian";
import { deserializeTable, markdownToHtml } from "./services/io/deserialize";
import { randomColumnId, randomCellId, randomRowId } from "./services/random";
import { useAppDispatch } from "./services/redux/hooks";
import { closeAllMenus, updateMenuPosition } from "./services/menu/menuSlice";

import _ from "lodash";
import { addExistingTag, addNewTag, removeTag } from "./services/table/tag";
import { changeColumnType } from "./services/table/column";
import Button from "./components/Button";

import "./app.css";
import { sortRows } from "./services/sort/sort";
interface Props {
	plugin: NltPlugin;
	tableId: string;
	viewMode: MarkdownViewModeType;
}

const COMPONENT_NAME = "App";

export default function App({ plugin, viewMode, tableId }: Props) {
	const [state, setTableState] = useState<TableState>({
		cacheVersion: -1,
		model: {
			rowIds: [],
			columnIds: [],
			cells: [],
		},
		settings: {
			columns: {},
		},
	});

	const [sortTime, setSortTime] = useState(0);
	const [isLoading, setLoading] = useState(true);
	const [saveTime, setSaveTime] = useState({
		time: 0,
		shouldSaveModel: false,
	});

	//const { columnWidths, rowHeights, cellRefs } = useTableSizing(state.model);

	const dispatch = useAppDispatch();

	const throttleTableScroll = _.throttle(() => {
		dispatch(closeAllMenus());
		dispatch(updateMenuPosition());
	}, 150);

	const handleTableScroll = () => throttleTableScroll();

	//Load table on mount
	useEffect(() => {
		async function load() {
			const tableState = await deserializeTable(plugin, tableId);
			setTableState(tableState);
			setTimeout(() => {
				setLoading(false);
			}, 300);
		}
		load();
	}, []);

	//We run the throttle save in a useEffect because we want the table model to update
	//with new changes before we save
	useEffect(() => {
		//If not mount
		if (saveTime.time !== 0) {
			throttleSave(saveTime.shouldSaveModel);
		}
	}, [saveTime]);

	const throttleSave = _.throttle(async (shouldSaveModel: boolean) => {
		const viewModesToUpdate: MarkdownViewModeType[] = [];
		if (plugin.isLivePreviewEnabled()) {
			viewModesToUpdate.push(
				viewMode === "source" ? "preview" : "source"
			);
		}
		await serializeTable(
			shouldSaveModel,
			plugin,
			state,
			tableId,
			viewModesToUpdate
		);
		//Make sure to update the menu positions, so that the menu will render properly
		dispatch(updateMenuPosition());
	}, 150);

	const handleSaveData = (shouldSaveModel: boolean) =>
		setSaveTime({ shouldSaveModel, time: Date.now() });

	//Handles sync between live preview and reading mode
	useEffect(() => {
		let timer: any = null;

		async function checkForUpdates() {
			const { tableId: tId, viewModes } = plugin.settings.viewModeSync;
			if (tId) {
				const mode = viewModes.find((v) => v === viewMode);
				if (mode && tableId === tId) {
					const modeIndex = viewModes.indexOf(mode);
					plugin.settings.viewModeSync.viewModes.splice(modeIndex, 1);
					if (plugin.settings.viewModeSync.viewModes.length === 0)
						plugin.settings.viewModeSync.tableId = null;
					setTableState(plugin.settings.data[tableId]);
					await plugin.saveSettings();
				}
			}
		}

		function viewModeSync() {
			timer = setInterval(() => {
				checkForUpdates();
			}, 100);
		}

		viewModeSync();
		return () => {
			clearInterval(timer);
		};
	}, []);

	useEffect(() => {
		setTableState((prevState) => {
			return {
				...prevState,
				model: sortRows(prevState),
			};
		});
	}, [sortTime]);

	function handleSortData() {
		setSortTime(Date.now());
	}

	function handleAddColumn() {
		if (DEBUG.APP) console.log("[App]: handleAddColumn called.");
		setTableState((prevState) => {
			const [model, settings] = addColumn(prevState);
			return {
				...prevState,
				model,
				settings,
			};
		});
		handleSaveData(true);
	}

	function handleAddRow() {
		if (DEBUG.APP) console.log("[App]: handleAddRow called.");
		setTableState((prevState) => {
			const model = addRow(prevState.model);
			return {
				...prevState,
				model: model,
			};
		});
		handleSaveData(true);
	}

	function handleHeaderTypeClick(columnId: string, type: CellType) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleHeaderTypeClick", {
				columnId,
				type,
			});

		setTableState((prevState) =>
			changeColumnType(prevState, columnId, type)
		);
		handleSaveData(false);
	}

	function handleHeaderSortSelect(columnId: string, sortDir: SortDir) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleHeaderSortSelect", {
				columnId,
				sortDir,
			});
		}
		setTableState((prevState) => {
			return {
				...prevState,
				settings: {
					...prevState.settings,
					columns: {
						...prevState.settings.columns,
						[columnId]: {
							...prevState.settings.columns[columnId],
							sortDir,
						},
					},
				},
			};
		});
		handleSaveData(false);
		handleSortData();
	}

	function handleCellContentChange(cellId: string, updatedMarkdown: string) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleCellContentChange", {
				cellId,
				updatedMarkdown,
			});
		}

		setTableState((prevState) => {
			return {
				...prevState,
				model: {
					...prevState.model,
					cells: prevState.model.cells.map((cell: Cell) => {
						if (cell.id === cellId) {
							return {
								...cell,
								markdown: updatedMarkdown,
								html: markdownToHtml(updatedMarkdown),
							};
						}
						return cell;
					}),
				},
			};
		});
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
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleAddTag", {
				cellId,
				columnId,
				rowId,
				markdown,
				html,
				color,
				canAddMultiple,
			});
		}
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
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleTagClick", {
				cellId,
				columnId,
				rowId,
				tagId,
				canAddMultiple,
			});
		}
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
		if (DEBUG.APP) console.log("[App]: handleRemoveTagClick called.");
		setTableState((prevState) =>
			removeTag(prevState, cellId, columnId, rowId, tagId)
		);
		handleSaveData(true);
	}

	function handleHeaderDeleteClick(columnId: string) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleHeaderDeleteClick", {
				columnId,
			});

		setTableState((prevState) => {
			const obj = { ...prevState.settings.columns };
			delete obj[columnId];

			return {
				...prevState,
				model: {
					...prevState.model,
					columnIds: prevState.model.columnIds.filter(
						(column) => column !== columnId
					),
					cells: cells.filter((cell) => cell.columnId !== columnId),
				},
				settings: {
					...prevState.settings,
					columns: obj,
				},
			};
		});
		handleSaveData(true);
	}

	function handleRowDeleteClick(rowId: string) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleRowDeleteClick", {
				rowId,
			});
		setTableState((prevState) => {
			return {
				...prevState,
				model: {
					...prevState.model,
					cells: prevState.model.cells.filter(
						(cell) => cell.rowId !== rowId
					),
					rowIds: prevState.model.rowIds.filter((id) => id !== rowId),
				},
			};
		});
		handleSaveData(true);
	}

	function handleHeaderWidthChange(columnId: string, width: string) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleHeaderWidthChange", {
				columnId,
				width,
			});
		}
		setTableState((prevState) => {
			return {
				...prevState,
				settings: {
					...prevState.settings,
					columns: {
						...prevState.settings.columns,
						[columnId]: {
							...prevState.settings.columns[columnId],
							width,
						},
					},
				},
			};
		});
		handleSaveData(false);
	}

	function handleMoveColumnClick(columnId: string, moveRight: boolean) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleMoveColumnClick", {
				columnId,
				moveRight,
			});
		setTableState((prevState: TableState) => {
			const { model } = prevState;
			const updatedColumnIds = [...model.columnIds];
			const index = model.columnIds.indexOf(columnId);
			const moveIndex = moveRight ? index + 1 : index - 1;

			//Swap values
			const old = updatedColumnIds[moveIndex];
			updatedColumnIds[moveIndex] = updatedColumnIds[index];
			updatedColumnIds[index] = old;

			const updatedCells = sortCells(
				model.rowIds,
				updatedColumnIds,
				model.cells
			);

			return {
				...prevState,
				model: {
					...model,
					columnIds: updatedColumnIds,
					cells: updatedCells,
				},
			};
		});
		handleSaveData(true);
	}

	function handleInsertColumnClick(columnId: string, insertRight: boolean) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleInsertColumnClick", {
				columnId,
				insertRight,
			});
		setTableState((prevState: TableState) => {
			const { model, settings } = prevState;
			const index = model.columnIds.indexOf(columnId);
			const insertIndex = insertRight ? index + 1 : index;

			const newColId = randomColumnId();
			const updatedColumnIds = [...model.columnIds];
			updatedColumnIds.splice(insertIndex, 0, newColId);

			let updatedCells = [...model.cells];

			for (let i = 0; i < model.rowIds.length; i++) {
				updatedCells.push({
					id: randomCellId(),
					columnId: newColId,
					rowId: model.rowIds[i],
					markdown: i === 0 ? "New Column" : "",
					html: i === 0 ? "New Column" : "",
					isHeader: i === 0,
				});
			}

			updatedCells = sortCells(
				model.rowIds,
				updatedColumnIds,
				updatedCells
			);

			const settingsObj = { ...settings };
			settingsObj.columns[newColId] = DEFAULT_COLUMN_SETTINGS;

			return {
				...prevState,
				model: {
					...model,
					columnIds: updatedColumnIds,
					cells: updatedCells,
				},
				settings: settingsObj,
			};
		});
		handleSaveData(true);
	}

	function handleChangeColor(columnId: string, tagId: string, color: string) {
		setTableState((prevState) => {
			const tags = [...prevState.settings.columns[columnId].tags];
			const index = tags.findIndex((t) => t.id === tagId);
			tags[index].color = color;
			return {
				...prevState,
				settings: {
					...prevState.settings,
					columns: {
						...prevState.settings.columns,
						[columnId]: {
							...prevState.settings.columns[columnId],
							tags,
						},
					},
				},
			};
		});
		handleSaveData(false);
	}

	function handleAutoWidthToggle(columnId: string, value: boolean) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleAutoWidthToggle", {
				columnId,
				value,
			});
		setTableState((prevState) => {
			return {
				...prevState,
				settings: {
					...prevState.settings,
					columns: {
						...prevState.settings.columns,
						[columnId]: {
							...prevState.settings.columns[columnId],
							useAutoWidth: value,
						},
					},
				},
			};
		});
		handleSaveData(false);
	}

	function handleWrapContentToggle(columnId: string, value: boolean) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleWrapContentToggle", {
				columnId,
				value,
			});
		setTableState((prevState) => {
			return {
				...prevState,
				settings: {
					...prevState.settings,
					columns: {
						...prevState.settings.columns,
						[columnId]: {
							...prevState.settings.columns[columnId],
							shouldWrapOverflow: value,
						},
					},
				},
			};
		});
		handleSaveData(false);
	}

	if (isLoading) return <div>Loading table...</div>;

	const { rowIds, columnIds, cells } = state.model;
	const tableIdWithMode = getUniqueTableId(tableId, viewMode);

	return (
		<div
			id={tableIdWithMode}
			data-id={tableId}
			className="NLT__app"
			tabIndex={0}
		>
			<OptionBar model={state.model} settings={state.settings} />
			<div className="NLT__table-wrapper" onScroll={handleTableScroll}>
				<Table
					headers={[
						...columnIds.map((columnId, i) => {
							const {
								width,
								type,
								sortDir,
								shouldWrapOverflow,
								useAutoWidth,
							} = state.settings.columns[columnId];

							const cell = cells.find(
								(c) => c.columnId === columnId && c.isHeader
							);
							const { id, markdown, html } = cell;
							return {
								id,
								component: (
									<EditableTh
										key={id}
										cellId={id}
										columnIndex={i}
										numColumns={columnIds.length}
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
							id: randomColumnId(),
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
					rows={rowIds
						.filter((_row, i) => i !== 0)
						.map((rowId) => {
							const rowCells = cells.filter(
								(cell) => cell.rowId === rowId
							);
							return {
								id: rowId,
								component: (
									<>
										{rowCells.map((cell, i) => {
											const {
												width,
												type,
												useAutoWidth,
												shouldWrapOverflow,
												tags,
											} =
												state.settings.columns[
													cell.columnId
												];
											const { id, markdown, html } = cell;

											return (
												<EditableTd
													key={id}
													cellId={id}
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
												<RowMenu
													rowId={rowId}
													onDeleteClick={
														handleRowDeleteClick
													}
												/>
											</div>
										</td>
									</>
								),
							};
						})}
					footers={[0].map((_id) => {
						const { width, type, useAutoWidth } =
							state.settings.columns[columnIds[0]];
						return {
							id: randomRowId(),
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
											<Button
												onClick={() => handleAddRow()}
											>
												New
											</Button>
										</div>
									</td>
									{columnIds.map((_id) => {
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
