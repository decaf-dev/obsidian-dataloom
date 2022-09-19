import React, { useState } from "react";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import EditableTh from "./components/EditableTh";
import OptionBar from "./components/OptionBar";

import { Cell, CellType } from "./services/table/types";
import { saveTableState } from "./services/external/save";
import { pxToNum } from "./services/string/conversion";
import NltPlugin from "./main";
import { SortDir } from "./services/sort/types";
import { addRow, addColumn } from "./services/internal/add";
import { logFunc } from "./services/debug";
import {
	useCloseMenusOnScroll,
	useDidMountEffect,
	useSaveTime,
} from "./services/hooks";
// import { sortRows } from "./services/sort/sort";
import {
	checkboxToContent,
	contentToCheckbox,
	findRowCells,
	getColumnIndex,
	getRowIndex,
} from "./services/table/utils";
import { TableState } from "./services/table/types";
import { MarkdownTable } from "./services/external/types";

import { DEBUG } from "./constants";

import "./app.css";

interface Props {
	plugin: NltPlugin;
	tableState: TableState;
	sourcePath: string;
	tableId: string;
	markdownTable: MarkdownTable;
	el: HTMLElement;
}

const COMPONENT_NAME = "App";

export default function App({
	plugin,
	tableState,
	sourcePath,
	tableId,
	markdownTable,
	el,
}: Props) {
	const [state, setTableState] = useState<TableState>(tableState);
	const [sortTime, setSortTime] = useState(0);
	const [positionUpdateTime, setPositionUpdateTime] = useState(0);

	const { saveTime, saveData } = useSaveTime();

	useCloseMenusOnScroll("markdown-preview-view");
	useCloseMenusOnScroll("NLT__table-wrapper");

	const { tableModel, tableSettings } = state;
	const { cells, numColumns } = tableModel;
	const headers = cells.filter((_cell, i) => i < numColumns);

	let rows: Cell[][] = [];
	for (let i = 1; i < cells.length / numColumns; i++) {
		const rowCells = findRowCells(i, cells, numColumns);
		rows.push(rowCells);
	}

	useDidMountEffect(() => {
		setTableState((prevState) => {
			return {
				...prevState,
				tableModel: {
					...prevState.tableModel,
					// rows: sortRows(state.tableModel, state.tableSettings),
				},
			};
		});
		forcePositionUpdate();
		saveData();
	}, [sortTime]);

	useDidMountEffect(() => {
		async function handleUpdate() {
			try {
				await saveTableState(
					plugin,
					state.tableModel,
					state.tableSettings,
					tableId,
					markdownTable,
					sourcePath
				);
			} catch (err) {
				console.log(err);
			}
		}

		handleUpdate();
	}, [saveTime]);

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
				prevState.tableModel,
				prevState.tableSettings
			);
			return {
				...prevState,
				tableModel: model,
				tableSettings: settings,
			};
		});
		saveData();
	}

	function handleAddRow() {
		if (DEBUG.APP) console.log("[App]: handleAddRow called.");
		setTableState((prevState) => {
			const model = addRow(prevState.tableModel);
			return {
				...prevState,
				tableModel: model,
			};
		});
		saveData();
	}

	function handleHeaderSave(cellId: string, updatedContent: string) {
		if (DEBUG.APP) console.log("[App]: handleHeaderSave called.");
		setTableState((prevState) => {
			return {
				...prevState,
				tableModel: {
					...prevState.tableModel,
					cells: prevState.tableModel.cells.map((cell) => {
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
		saveData();
	}

	function handleHeaderTypeClick(
		cellId: string,
		columnIndex: number,
		selectedCellType: CellType
	) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleHeaderTypeClick", {
				cellId,
				columnIndex,
				selectedCellType,
			});
		const { type } = state.tableSettings.columns[columnIndex];
		//If same header type return
		if (type === selectedCellType) return;

		function findUpdatedCellContent(content: string) {
			if (type === CellType.CHECKBOX) {
				return checkboxToContent(content);
			} else if (selectedCellType === CellType.CHECKBOX) {
				return contentToCheckbox(content);
			} else {
				return content;
			}
		}

		setTableState((prevState) => {
			return {
				...prevState,
				tableModel: {
					...prevState.tableModel,
					cells: prevState.tableModel.cells.map((cell: Cell) => {
						if (cell.id === cellId) {
							return {
								...cell,
								content: findUpdatedCellContent(cell.content),
							};
						}
						return cell;
					}),
				},
				tableSettings: {
					...prevState.tableSettings,
					columns: {
						...prevState.tableSettings.columns,
						[columnIndex]: {
							...prevState.tableSettings.columns[columnIndex],
							type: selectedCellType,
						},
					},
				},
			};
		});
		saveData();
	}

	function handleHeaderSortSelect(columnIndex: number, sortDir: SortDir) {
		if (DEBUG.APP) console.log("[App]: handleHeaderSort called.");
		setTableState((prevState) => {
			return {
				...prevState,
				tableSettings: {
					...prevState.tableSettings,
					columns: {
						...prevState.tableSettings.columns,
						[columnIndex]: {
							...prevState.tableSettings.columns[columnIndex],
							sortDir,
						},
					},
				},
			};
		});
		sortData();
	}

	function handleCellContentSave() {
		sortData();
	}

	function handleCellContentChange(
		id: string,
		headerType: string,
		updatedContent: string,
		saveOnChange = false
	) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleCellContentChange", {
				id,
				headerType,
				updatedContent,
			});
		}

		setTableState((prevState) => {
			return {
				...prevState,
				tableModel: {
					...prevState.tableModel,
					cells: prevState.tableModel.cells.map((cell: Cell) => {
						if (cell.id === id) {
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
		if (saveOnChange) saveData();
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

	function handleHeaderDeleteClick(columnIndex: number) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleHeaderDeleteClick", {
				columnIndex,
			});

		setTableState((prevState) => {
			//Remove the column at the selection index and shift the other columns over
			const columns = Object.fromEntries(
				Object.entries(prevState.tableSettings.columns)
					.map((entry) => {
						const [key, value] = entry;
						const cIndex = parseInt(key);
						if (cIndex < columnIndex) return entry;
						else if (cIndex === columnIndex)
							return ["delete", value];
						else return [cIndex - 1, value];
					})
					.filter((entry) => {
						const [key] = entry;
						return key !== "delete";
					})
			);
			//Shift the columns over
			const value = {
				...prevState,
				tableModel: {
					...prevState.tableModel,
					cells: prevState.tableModel.cells.filter(
						(_cell, i) =>
							columnIndex !== getColumnIndex(i, numColumns)
					),
					numColumns: prevState.tableModel.numColumns - 1,
				},
				tableSettings: {
					...prevState.tableSettings,
					columns,
				},
			};
			return value;
		});
		sortData();
	}

	function handleRowDeleteClick(rowIndex: number) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleRowDeleteClick", {
				rowIndex,
			});
		setTableState((prevState) => {
			return {
				...prevState,
				tableModel: {
					...prevState.tableModel,
					cells: prevState.tableModel.cells.filter(
						(_cell, i) => rowIndex !== getRowIndex(i, numColumns)
					),
				},
			};
		});
		sortData();
	}

	function handleHeaderWidthChange(columnIndex: number, width: string) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleHeaderWidthChange", {
				columnIndex,
				width,
			});
		}
		setTableState((prevState) => {
			return {
				...prevState,
				tableSettings: {
					...prevState.tableSettings,
					columns: {
						...prevState.tableSettings.columns,
						[columnIndex]: {
							...prevState.tableSettings.columns[columnIndex],
							width,
						},
					},
				},
			};
		});
		forcePositionUpdate();
		saveData(true);
	}

	function handleMoveColumnClick(columnIndex: number, moveRight: boolean) {
		if (DEBUG.APP) console.log("[App]: handleMoveColumnClick called.");
		//TODO edit
		// setTableModel((prevState: TableModel) => {
		// 	const index = prevState.headers.findIndex(
		// 		(header) => header.id === id
		// 	);
		// 	const moveIndex = moveRight ? index + 1 : index - 1;
		// 	const headers = [...prevState.headers];

		// 	//Swap values
		// 	const old = headers[moveIndex];
		// 	headers[moveIndex] = headers[index];
		// 	headers[index] = old;
		// 	return {
		// 		...prevState,
		// 		headers,
		// 	};
		// });
		saveData();
	}

	function handleInsertColumnClick(
		columnIndex: number,
		insertRight: boolean
	) {
		if (DEBUG.APP) console.log("[App]: handleInsertColumnClick called.");
		//TODO edit
		// setTableModel((prevState: TableModel) => {
		// 	const header = prevState.headers.find((header) => header.id === id);
		// 	const index = prevState.headers.indexOf(header);
		// 	const insertIndex = insertRight ? index + 1 : index;
		// 	const title = "New Column";
		// 	const headerToInsert = initialHeader(uuid(), title, title);

		// 	const cells = prevState.rows.map((row) =>
		// 		initialCell(uuid(), headerToInsert.id, row.id, "", "")
		// 	);

		// 	const headers = [...prevState.headers];
		// 	headers.splice(insertIndex, 0, headerToInsert);

		// 	return {
		// 		...prevState,
		// 		headers,
		// 		cells: [...prevState.cells, ...cells],
		// 	};
		// });
		saveData();
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
		saveData();
	}

	function handleAutoWidthToggle(columnIndex: number, value: boolean) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleAutoWidthToggle", {
				columnIndex,
				value,
			});
		setTableState((prevState) => {
			return {
				...prevState,
				tableSettings: {
					...prevState.tableSettings,
					columns: {
						...prevState.tableSettings.columns,
						[columnIndex]: {
							...prevState.tableSettings.columns[columnIndex],
							useAutoWidth: value,
						},
					},
				},
			};
		});
		saveData();
	}

	function handleWrapContentToggle(columnIndex: number, value: boolean) {
		if (DEBUG.APP)
			logFunc(COMPONENT_NAME, "handleWrapContentToggle", {
				columnIndex,
				value,
			});
		setTableState((prevState) => {
			return {
				...prevState,
				tableSettings: {
					...prevState.tableSettings,
					columns: {
						...prevState.tableSettings.columns,
						[columnIndex]: {
							...prevState.tableSettings.columns[columnIndex],
							shouldWrapOverflow: value,
						},
					},
				},
			};
		});
		saveData();
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

	return (
		<div className="NLT__app" tabIndex={0}>
			<OptionBar headers={headers} tableSettings={tableSettings} />
			<div className="NLT__table-wrapper">
				<Table
					headers={headers.map((cell, i) => {
						const {
							width,
							type,
							sortDir,
							shouldWrapOverflow,
							useAutoWidth,
						} = tableSettings.columns[i];

						const { id, content, textContent } = cell;
						return {
							id,
							component: (
								<EditableTh
									key={id}
									cellId={id}
									columnIndex={i}
									width={findCellWidth(
										type,
										useAutoWidth,
										width
									)}
									shouldWrapOverflow={shouldWrapOverflow}
									useAutoWidth={useAutoWidth}
									positionUpdateTime={positionUpdateTime}
									content={content}
									textContent={textContent}
									type={type}
									sortDir={sortDir}
									numColumns={numColumns}
									onSortSelect={handleHeaderSortSelect}
									onInsertColumnClick={
										handleInsertColumnClick
									}
									onMoveColumnClick={handleMoveColumnClick}
									onWidthChange={handleHeaderWidthChange}
									onDeleteClick={handleHeaderDeleteClick}
									onSaveClick={handleHeaderSave}
									onTypeSelect={handleHeaderTypeClick}
									onAutoWidthToggle={handleAutoWidthToggle}
									onWrapOverflowToggle={
										handleWrapContentToggle
									}
								/>
							),
						};
					})}
					rows={rows.map((rowCells, i) => {
						const rowIndex = i + 1;
						return {
							id: rowCells[0].id, //TODO optimize
							component: (
								<>
									{rowCells.map((cell, cellIndex) => {
										const columnIndex = getColumnIndex(
											cellIndex,
											numColumns
										);
										const {
											width,
											type,
											useAutoWidth,
											shouldWrapOverflow,
										} = tableSettings.columns[columnIndex];

										const { id, content, textContent } =
											cell;
										return (
											<EditableTd
												key={id}
												cellId={id}
												content={content}
												textContent={textContent}
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
												onSaveContent={
													handleCellContentSave
												}
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
												rowIndex={rowIndex}
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
