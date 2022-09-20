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
import {
	useCloseMenusOnScroll,
	useDidMountEffect,
	useSaveTime,
} from "./services/hooks";
// import { sortRows } from "./services/sort/sort";
import { checkboxToContent, contentToCheckbox } from "./services/table/utils";
import { TableState } from "./services/table/types";

import { DEBUG } from "./constants";

import "./app.css";
import { MarkdownViewModeType } from "obsidian";
import { loadTableState } from "./services/io/deserialize";
import { randomColumnId, randomCellId } from "./services/random";

interface Props {
	plugin: NltPlugin;
	tableId: string;
	viewMode: MarkdownViewModeType;
}

const COMPONENT_NAME = "App";

//TODO only call this function if the model has changed
//currentTime
//update model
export default function App({ plugin, viewMode, tableId }: Props) {
	const [state, setTableState] = useState<TableState>(null);

	const [sortTime, setSortTime] = useState(0);
	const [positionUpdateTime, setPositionUpdateTime] = useState(0);
	const [isLoading, setLoading] = useState(true);

	const { saveTime, shouldSaveModel, saveData } = useSaveTime();

	useCloseMenusOnScroll("markdown-preview-view");
	useCloseMenusOnScroll("NLT__table-wrapper");

	useDidMountEffect(() => {
		async function save() {
			await serializeTable(
				shouldSaveModel,
				plugin,
				state.model,
				state.settings,
				tableId
			);
		}
		save();
	}, [saveTime, shouldSaveModel]);

	//Load table
	useEffect(() => {
		async function load() {
			const tableState = await loadTableState(plugin, tableId);
			setTableState(tableState);
			setTimeout(() => {
				setLoading(false);
			}, 300);
		}
		load();
	}, []);

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
	// 	forcePositionUpdate();
	// 	saveData();
	// }, [sortTime]);

	//TODO add save

	function sortData() {
		setSortTime(Date.now());
	}

	function forcePositionUpdate() {
		setPositionUpdateTime(Date.now());
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
			const { type } = prevState.settings.columns[columnId];
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
								content: findUpdatedCellContent(
									type,
									cell.markdown
								),
							};
						}
						return cell;
					}),
				},
				tableSettings: {
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
		if (DEBUG.APP) console.log("[App]: handleHeaderSort called.");
		setTableState((prevState) => {
			return {
				...prevState,
				tableSettings: {
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

	function handleCellContentChange(
		cellId: string,
		updatedContent: string,
		saveOnChange = false
	) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleCellContentChange", {
				cellId,
				updatedContent,
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
								content: updatedContent,
							};
						}
						return cell;
					}),
				},
			};
		});
		if (saveOnChange) saveData(true);
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
		forcePositionUpdate();
		saveData(true);
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
				tableSettings: {
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
				tableSettings: {
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
	// 				headerSettings = tableSettings.columns[i];
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
	let headers: Cell[] = [];

	return (
		<div className="NLT__app" tabIndex={0}>
			<OptionBar model={state.model} settings={state.settings} />
			<div className="NLT__table-wrapper">
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
									positionUpdateTime={positionUpdateTime}
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
													positionUpdateTime={
														positionUpdateTime
													}
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
													positionUpdateTime={
														positionUpdateTime
													}
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
