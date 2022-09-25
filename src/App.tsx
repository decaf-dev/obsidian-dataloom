import React, { useEffect, useState } from "react";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import EditableTh from "./components/EditableTh";
import OptionBar from "./components/OptionBar";

import { Cell, CellType } from "./services/table/types";
import { serializeTable } from "./services/io/serialize";
import { pxToNum } from "./services/string/conversion";
import NltPlugin from "./main";
import { SortDir } from "./services/sort/types";
import { addRow, addColumn } from "./services/internal/add";
import { logFunc } from "./services/debug";
import { DEFAULT_COLUMN_SETTINGS } from "./services/table/types";
import { initialCell } from "./services/io/utils";
import { getUniqueTableId } from "./services/table/utils";
import { useDidMountEffect, useSaveTime } from "./services/hooks";
// import { sortRows } from "./services/sort/sort";
import { checkboxToContent, contentToCheckbox } from "./services/table/utils";
import { TableState } from "./services/table/types";

import { DEBUG } from "./constants";

import "./app.css";
import { MarkdownViewModeType } from "obsidian";
import { deserializeTable, markdownToHtml } from "./services/io/deserialize";
import { randomColumnId, randomCellId } from "./services/random";
import { useAppDispatch, useAppSelector } from "./services/redux/hooks";
import {
	closeAllMenus,
	getTopLevelMenu,
	updateMenuPosition,
} from "./services/menu/menuSlice";

import _ from "lodash";

interface Props {
	plugin: NltPlugin;
	tableId: string;
	viewMode: MarkdownViewModeType;
}

const COMPONENT_NAME = "App";

export default function App({ plugin, viewMode, tableId }: Props) {
	const [state, setTableState] = useState<TableState>(null);

	const [sortTime, setSortTime] = useState(0);
	const [isLoading, setLoading] = useState(true);

	const { saveTime, shouldSaveModel, saveData } = useSaveTime();

	const tableIdWithMode = getUniqueTableId(tableId, viewMode);
	const dispatch = useAppDispatch();
	const topLevelMenu = useAppSelector((state) => getTopLevelMenu(state));

	const throttleTableScroll = _.throttle(() => {
		if (topLevelMenu) dispatch(closeAllMenus());
		dispatch(updateMenuPosition());
	}, 150);

	const handleTableScroll = () => {
		throttleTableScroll();
	};

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

	//Handles saving
	useDidMountEffect(() => {
		async function save() {
			await serializeTable(
				shouldSaveModel,
				plugin,
				state,
				tableId,
				viewMode
			);
		}
		save();
	}, [saveTime, shouldSaveModel]);

	//Handles live preview
	//TODO disable if live preview is not enabled
	useEffect(() => {
		let timer: any = null;

		async function checkDirty() {
			const dirty = plugin.settings.dirty;
			if (dirty) {
				const { viewMode: dirtyViewMode, tableId: dirtyTableId } =
					dirty;
				const shouldUpdate =
					dirtyTableId === tableId && dirtyViewMode !== viewMode;
				if (shouldUpdate) {
					setLoading(true);
					plugin.settings.dirty = null;
					await plugin.saveSettings();
					const state = await deserializeTable(plugin, tableId);
					setTableState(state);
					setTimeout(() => {
						setLoading(false);
					}, 300);
				}
			}
		}

		function livePreviewSync() {
			timer = setInterval(() => {
				checkDirty();
			}, plugin.settings.syncInterval);
		}

		if (plugin.isLivePreviewEnabled()) livePreviewSync();
		return () => {
			clearInterval(timer);
		};
	}, [plugin.settings.dirty]);

	//TODO add
	// useDidMountEffect(() => {
	// 	setTableState((prevState) => {
	// 		return {
	// 			...prevState,
	// 			model: {
	// 				...prevState.model,
	// 				// rows: sortRows(state.model, state.settings),
	// 			},
	// 		};
	// 	});
	// 	saveData();
	// }, [sortTime]);

	//TODO add save

	function sortData() {
		setSortTime(Date.now());
	}

	function handleAddColumn() {
		if (DEBUG.APP) console.log("[App]: handleAddColumn called.");
		setTableState((prevState) => {
			const [model, settings] = addColumn(
				prevState.model,
				prevState.settings
			);
			return {
				...prevState,
				model,
				settings,
			};
		});
		saveData(true);
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
		saveData(true);
	}

	function handleHeaderTypeClick(
		cellId: string,
		columnId: string,
		selectedCellType: CellType
	) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleHeaderTypeClick", {
				cellId,
				columnId,
				selectedCellType,
			});

		function findUpdatedCellContent(type: CellType, content: string) {
			if (type === CellType.CHECKBOX) {
				return checkboxToContent(content);
			} else if (selectedCellType === CellType.CHECKBOX) {
				return contentToCheckbox(content);
			} else {
				return content;
			}
		}

		setTableState((prevState) => {
			const { settings } = prevState;
			const { type } = settings.columns[columnId];

			//If same header type return
			if (type === selectedCellType) return prevState;
			return {
				...prevState,
				model: {
					...prevState.model,
					cells: prevState.model.cells.map((cell: Cell) => {
						if (cell.id === cellId) {
							return {
								...cell,
								markdown: findUpdatedCellContent(
									type,
									cell.markdown
								),
							};
						}
						return cell;
					}),
				},
				settings: {
					...prevState.settings,
					columns: {
						...prevState.settings.columns,
						[columnId]: {
							...prevState.settings.columns[columnId],
							type: selectedCellType,
						},
					},
				},
			};
		});
		saveData(true);
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
		//TODO add save
		sortData();
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
		saveData(true, true);
	}

	function handleAddTag(cellId: string, content: string, color: string) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleAddTag", {
				cellId,
				content,
				color,
			});
		}
		//TODO fix
		// setTableModel((prevState) => {
		// 	return {
		// 		...prevState,
		// 		tags: [
		// 			...removeTagReferences(prevState.tags, cellId),
		// 			initialTag(uuid(), headerId, cellId, content, color),
		// 		],
		// 	};
		// });
	}

	function handleTagClick(cellId: string, tagId: string) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleTagClick", {
				cellId,
				tagId,
			});
		}
		//TODO fix
	}

	function handleRemoveTagClick(cellId: string) {
		if (DEBUG.APP) console.log("[App]: handleRemoveTagClick called.");
		//TODO fix
		// setTableModel((prevState) => {
		// 	return {
		// 		...prevState,
		// 		tags: removeTagReferences(prevState.tags, cellId),
		// 	};
		// });
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
					columns: prevState.model.columns.filter(
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

		//TODO edit
		saveData(true);
		//sortData();
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
					rows: prevState.model.rows.filter((id) => id !== rowId),
				},
			};
		});
		sortData();
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
		saveData(true, true);
	}

	function handleMoveColumnClick(columnId: string, moveRight: boolean) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleMoveColumnClick", {
				columnId,
				moveRight,
			});
		setTableState((prevState: TableState) => {
			const { model } = prevState;
			const columnArr = [...model.columns];
			const index = columnArr.indexOf(columnId);
			const moveIndex = moveRight ? index + 1 : index - 1;

			//Swap values
			const old = columnArr[moveIndex];
			columnArr[moveIndex] = columnArr[index];
			columnArr[index] = old;

			console.log({
				...prevState,
				model: {
					...model,
					columns: columnArr,
				},
			});
			return {
				...prevState,
				model: {
					...model,
					columns: columnArr,
				},
			};
		});
		saveData(true);
	}

	function handleInsertColumnClick(columnId: string, insertRight: boolean) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleInsertColumnClick", {
				columnId,
				insertRight,
			});
		setTableState((prevState: TableState) => {
			const { model, settings } = prevState;
			const index = prevState.model.columns.indexOf(columnId);
			const insertIndex = insertRight ? index + 1 : index;

			const newColId = randomColumnId();

			const cellArr = [...model.cells];

			for (let i = 0; i < model.rows.length; i++) {
				let markdown = "";
				let html = "";
				if (i === 0) {
					markdown = "New Column";
					html = "New Column";
				}

				cellArr.push(
					initialCell(
						randomCellId(),
						newColId,
						model.rows[i],
						markdown,
						html
					)
				);
			}

			const columnArr = [...model.columns];
			columnArr.splice(insertIndex, 0, newColId);

			const settingsObj = { ...settings };
			settingsObj.columns[newColId] = DEFAULT_COLUMN_SETTINGS;

			console.log({
				...prevState,
				model: {
					...model,
					columns: columnArr,
					cells: cellArr,
				},
				settings: settingsObj,
			});
			return {
				...prevState,
				model: {
					...model,
					columns: columnArr,
					cells: cellArr,
				},
				settings: settingsObj,
			};
		});
		saveData(true);
	}

	function handleChangeColor(tagId: string, color: string) {
		//TODO edit
		// setTableModel((prevState) => {
		// 	return {
		// 		...prevState,
		// 		tags: prevState.tags.map((tag) => {
		// 			if (tag.id === tagId) {
		// 				return {
		// 					...tag,
		// 					color,
		// 				};
		// 			}
		// 			return tag;
		// 		}),
		// 	};
		// });
		saveData(true);
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
		saveData(false);
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
		saveData(false);
	}

	function measureElement(
		textContent: string,
		useAutoWidth: boolean,
		columnWidth: string,
		shouldWrapOverflow: boolean
	): { width: number; height: number } {
		const ruler = document.createElement("div");

		if (useAutoWidth) {
			ruler.style.width = "max-content";
			ruler.style.height = "auto";
			ruler.style.overflowWrap = "normal";
		} else {
			ruler.style.width = columnWidth;
			ruler.style.height = "max-content";
			if (shouldWrapOverflow) {
				ruler.style.overflowWrap = "break-word";
			} else {
				ruler.style.overflowWrap = "normal";
				ruler.style.whiteSpace = "nowrap";
				ruler.style.overflow = "hidden";
				ruler.style.textOverflow = "ellipsis";
			}
		}
		//This is the same as the padding set to every cell
		ruler.style.paddingTop = "4px";
		ruler.style.paddingBottom = "4px";
		ruler.style.paddingLeft = "10px";
		ruler.style.paddingRight = "10px";
		ruler.innerHTML = textContent;

		document.body.appendChild(ruler);
		const width = window.getComputedStyle(ruler).getPropertyValue("width");
		const height = window
			.getComputedStyle(ruler)
			.getPropertyValue("height");

		document.body.removeChild(ruler);
		return { width: pxToNum(width), height: pxToNum(height) };
	}

	function findCellWidth(
		headerType: string,
		useAutoWidth: boolean,
		headerWidth: string
	) {
		//If the content type does not display text, just use the width that we set for the column
		if (headerType !== CellType.TEXT && headerType !== CellType.NUMBER)
			return headerWidth;
		//If we're not using auto width, just use the width that we set for the column
		if (useAutoWidth) return "auto";
		return headerWidth;
	}

	// const cellSizes = useMemo(() => {
	// 	return tableModel.cells.map((cell) => {
	// 		let header = null;
	// 		let headerSettings = null;
	// 		for (let i = 0; i < tableModel.headers.length; i++) {
	// 			const h = tableModel.headers[i];
	// 			if (h.id === cell.headerId) {
	// 				header = tableModel.headers[i];
	// 				headerSettings = settings.columns[i];
	// 			}
	// 		}
	// 		const { width, height } = measureElement(
	// 			cell.content,
	// 			headerSettings.useAutoWidth,
	// 			headerSettings.width,
	// 			headerSettings.shouldWrapOverflow
	// 		);
	// 		return {
	// 			rowId: cell.rowId,
	// 			headerId: header.id,
	// 			width,
	// 			height,
	// 		};
	// 	});
	// }, [tableModel.cells]);

	// const rowHeights = useMemo(() => {
	// 	const heights: { [id: string]: number } = {};
	// 	cellSizes.forEach((size) => {
	// 		const { rowId, height } = size;
	// 		if (!heights[rowId] || heights[rowId] < height)
	// 			heights[rowId] = height;
	// 	});
	// 	return Object.fromEntries(
	// 		Object.entries(heights).map((entry) => {
	// 			const [key, value] = entry;
	// 			return [key, numToPx(value)];
	// 		})
	// 	);
	// }, [cellSizes]);

	// const columnWidths = useMemo(() => {
	// 	const widths: { [id: string]: number } = {};
	// 	cellSizes.forEach((size) => {
	// 		const { headerId, width: cellWidth } = size;
	// 		let width = cellWidth;
	// 		if (width < MIN_COLUMN_WIDTH_PX) width = MIN_COLUMN_WIDTH_PX;
	// 		if (!widths[headerId] || widths[headerId] < width)
	// 			widths[headerId] = width;
	// 	});
	// 	return Object.fromEntries(
	// 		Object.entries(widths).map((entry) => {
	// 			const [key, value] = entry;
	// 			return [key, numToPx(value)];
	// 		})
	// 	);
	// }, [cellSizes]);

	if (isLoading) return <div>Loading table...</div>;

	const { rows, columns, cells } = state.model;

	return (
		<div id={tableIdWithMode} className="NLT__app" tabIndex={0}>
			<OptionBar model={state.model} settings={state.settings} />
			<div className="NLT__table-wrapper" onScroll={handleTableScroll}>
				<Table
					headers={columns.map((columnId, i) => {
						const {
							width,
							type,
							sortDir,
							shouldWrapOverflow,
							useAutoWidth,
						} = state.settings.columns[columnId];

						const cell = cells.find(
							(c) =>
								c.rowId === rows[0] && c.columnId === columnId
						);
						const { id, markdown, html } = cell;
						return {
							id,
							component: (
								<EditableTh
									key={id}
									cellId={id}
									columnIndex={i}
									numColumns={columns.length}
									columnId={cell.columnId}
									width={findCellWidth(
										type,
										useAutoWidth,
										width
									)}
									shouldWrapOverflow={shouldWrapOverflow}
									useAutoWidth={useAutoWidth}
									content={markdown}
									textContent={html}
									type={type}
									sortDir={sortDir}
									onSortSelect={handleHeaderSortSelect}
									onInsertColumnClick={
										handleInsertColumnClick
									}
									onMoveColumnClick={handleMoveColumnClick}
									onWidthChange={handleHeaderWidthChange}
									onDeleteClick={handleHeaderDeleteClick}
									onSaveClick={handleCellContentChange}
									onTypeSelect={handleHeaderTypeClick}
									onAutoWidthToggle={handleAutoWidthToggle}
									onWrapOverflowToggle={
										handleWrapContentToggle
									}
								/>
							),
						};
					})}
					rows={rows
						.filter((_row, i) => i !== 0)
						.map((rowId, i) => {
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
											} =
												state.settings.columns[
													cell.columnId
												];

											const { id, markdown, html } = cell;
											return (
												<EditableTd
													key={id}
													cellId={id}
													content={markdown}
													textContent={html}
													columnType={type}
													shouldWrapOverflow={
														shouldWrapOverflow
													}
													useAutoWidth={useAutoWidth}
													width={findCellWidth(
														type,
														useAutoWidth,
														width
													)}
													height="auto"
													onTagClick={handleTagClick}
													onRemoveTagClick={
														handleRemoveTagClick
													}
													onContentChange={
														handleCellContentChange
													}
													onSaveContent={() => {
														//TODO sort? save?
														saveData(true);
													}}
													onColorChange={
														handleChangeColor
													}
													onAddTag={handleAddTag}
												/>
											);
										})}
										<td
											className="NLT__td"
											style={{
												height: "auto",
											}}
										>
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
					onAddColumn={handleAddColumn}
					onAddRow={handleAddRow}
				/>
			</div>
		</div>
	);
}
