import React, { useState, useMemo } from "react";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import EditableTh from "./components/EditableTh";
import OptionBar from "./components/OptionBar";

import { initialHeader, initialCell } from "./services/table/initialState";
import { Cell, TableModel, CellType } from "./services/table/types";
import { saveTableState } from "./services/external/save";
import { numToPx, pxToNum } from "./services/string/conversion";

import { DEBUG, MIN_COLUMN_WIDTH_PX } from "./constants";

import "./app.css";
import NltPlugin from "./main";
import { SortDir } from "./services/sort/types";
import { addRow, addColumn } from "./services/internal/add";
import { findCurrentViewType } from "./services/external/loadUtils";
import { v4 as uuid } from "uuid";
import { logFunc } from "./services/debug";

import {
	useCloseMenusOnScroll,
	useDidMountEffect,
	useId,
	useSaveTime,
} from "./services/hooks";
import { sortRows } from "./services/sort/sort";
import { MarkdownSectionInformation } from "obsidian";
import { checkboxToContent, contentToCheckbox } from "./services/table/utils";
import { randomColor } from "./services/random";
import { TableState } from "./services/table/types";
import { textContent } from "domutils";

interface Props {
	plugin: NltPlugin;
	tableState: TableState;
	sourcePath: string;
	blockId: string;
	sectionInfo: MarkdownSectionInformation;
	el: HTMLElement;
}

const COMPONENT_NAME = "App";

export default function App({
	plugin,
	tableState,
	sourcePath,
	blockId,
	sectionInfo,
	el,
}: Props) {
	const [state, setTableState] = useState<TableState>(tableState);
	const tableId = useId();
	const [tagUpdate, setTagUpdate] = useState({
		time: 0,
		cellId: "",
	});
	const [sortTime, setSortTime] = useState(0);
	const [positionUpdateTime, setPositionUpdateTime] = useState(0);

	const { saveTime, saveData } = useSaveTime();

	useCloseMenusOnScroll("markdown-preview-view");
	useCloseMenusOnScroll("NLT__table-wrapper");

	useDidMountEffect(() => {
		setTableState((prevState) => {
			return {
				...prevState,
				tableModel: {
					...prevState.tableModel,
					rows: sortRows(state.tableModel, state.tableSettings),
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
					blockId,
					sectionInfo,
					sourcePath,
					findCurrentViewType(el)
				);
			} catch (err) {
				console.log(err);
			}
		}

		handleUpdate();
	}, [saveTime]);

	// //If a table updates in editing mode or reading mode, update the other table
	// //TODO change with notifier in the main.js
	// //TODO why doesn't this always update?
	// useEffect(() => {
	// 	let intervalId: NodeJS.Timer = null;
	// 	function startTimer() {
	// 		intervalId = setInterval(async () => {
	// 			if (settings.state[sourcePath]) {
	// 				if (settings.state[sourcePath][tableIndex]) {
	// 					const { shouldUpdate, viewType } =
	// 						settings.state[sourcePath][tableIndex];

	// 					const currentViewType = findCurrentViewType(el);

	// 					if (shouldUpdate && viewType !== currentViewType) {
	// 						clearInterval(intervalId);
	// 						settings.state[sourcePath][
	// 							tableIndex
	// 						].shouldUpdate = false;
	// 						await plugin.saveSettings();
	// 						const savedData =
	// 							settings.state[sourcePath][tableIndex].data;
	// 						setOldTableModel(savedData);
	// 						setTableModel(savedData);
	// 						startTimer();
	// 					}
	// 				}
	// 			}
	// 		}, 500);
	// 	}
	// 	startTimer();
	// 	return () => clearInterval(intervalId);
	// }, []);

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

	function handleHeaderSave(id: string, updatedContent: string) {
		if (DEBUG.APP) console.log("[App]: handleHeaderSave called.");
		setTableState((prevState) => {
			return {
				...prevState,
				tableModel: {
					...prevState.tableModel,
					headers: prevState.tableModel.headers.map((header) => {
						if (header.id === id)
							return {
								...header,
								content: updatedContent,
							};
						return header;
					}),
				},
			};
		});
		saveData();
	}

	function handleHeaderTypeSelect(
		id: string,
		index: number,
		selectedCellType: CellType
	) {
		if (DEBUG.APP) console.log("[App]: handleHeaderTypeSelect called.");
		const { type } = state.tableSettings.columns[index];
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
					headers: prevState.tableModel.headers.map((header) => {
						if (id === header.id)
							return { ...header, type: selectedCellType };
						return header;
					}),
					cells: prevState.tableModel.cells.map((cell: Cell) => {
						if (cell.headerId === id) {
							return {
								...cell,
								content: findUpdatedCellContent(cell.content),
								type: selectedCellType,
							};
						}
						return cell;
					}),
				},
			};
		});
		saveData();
	}

	function handleHeaderSortSelect(index: number, sortDir: SortDir) {
		if (DEBUG.APP) console.log("[App]: handleHeaderSort called.");
		setTableState((prevState) => {
			return {
				...prevState,
				tableSettings: {
					...prevState.tableSettings,
					columns: {
						...prevState.tableSettings.columns,
						[index]: {
							...prevState.tableSettings.columns[index],
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

	function handleAddTag(
		cellId: string,
		headerId: string,
		content: string,
		color: string
	) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleAddTag", {
				cellId,
				headerId,
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
		// setTagUpdate({ cellId, time: Date.now() });
	}

	function handleTagClick(cellId: string, tagId: string) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleTagClick", {
				cellId,
				tagId,
			});
		}
		//TODO fix
		//setTagUpdate({ cellId, time: Date.now() });
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

	function handleDeleteHeaderClick(id: string, index: number) {
		if (DEBUG.APP) console.log("[App]: handleDeleteHeaderClick called.");
		setTableState((prevState) => {
			return {
				...prevState,
				tableModel: {
					...prevState.tableModel,
					headers: prevState.tableModel.headers.filter(
						(header) => header.id !== id
					),
				},
				tableSettings: {
					...prevState.tableSettings,
					columns: Object.fromEntries(
						Object.entries(prevState.tableSettings.columns).filter(
							(entry) => {
								const [key] = entry;
								if (parseInt(key) !== index) return true;
								return false;
							}
						)
					),
				},
			};
		});
		sortData();
	}

	function handleDeleteRowClick(rowId: string) {
		if (DEBUG.APP) console.log("[App]: handleDeleteRowClick called.");
		setTableState((prevState) => {
			return {
				...prevState,
				tabelModel: {
					...prevState.tableModel,
					rows: prevState.tableModel.rows.filter(
						(row) => row.id !== rowId
					),
					cells: prevState.tableModel.cells.filter(
						(cell) => cell.rowId !== rowId
					),
				},
			};
		});
		sortData();
	}

	function handleHeaderWidthChange(index: number, width: string) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleHeaderWidthChange", {
				index,
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
						[index]: {
							...prevState.tableSettings.columns[index],
							width,
						},
					},
				},
			};
		});
		forcePositionUpdate();
		saveData(true);
	}

	function handleMoveColumnClick(id: string, moveRight: boolean) {
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

	function handleInsertColumnClick(id: string, insertRight: boolean) {
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

	function handleAutoWidthToggle(index: number, value: boolean) {
		setTableState((prevState) => {
			return {
				...prevState,
				tableSettings: {
					...prevState.tableSettings,
					columns: {
						...prevState.tableSettings.columns,
						[index]: {
							...prevState.tableSettings.columns[index],
							useAutoWidth: value,
						},
					},
				},
			};
		});
	}

	function handleWrapContentToggle(index: number, value: boolean) {
		setTableState((prevState) => {
			return {
				...prevState,
				tableSettings: {
					...prevState.tableSettings,
					columns: {
						...prevState.tableSettings.columns,
						[index]: {
							...prevState.tableSettings.columns[index],
							shouldWrapOverflow: value,
						},
					},
				},
			};
		});
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
		cellType: string,
		useAutoWidth: boolean,
		calculatedWidth: string,
		headerWidth: string
	) {
		//If the content type does not display text, just use the width that we set for the column
		if (cellType !== CellType.TEXT && cellType !== CellType.NUMBER)
			return headerWidth;
		//If we're not using auto width, just use the width that we set for the column
		if (useAutoWidth) return calculatedWidth;
		return headerWidth;
	}

	const { tableModel, tableSettings } = state;

	const cellSizes = useMemo(() => {
		return tableModel.cells.map((cell) => {
			let header = null;
			let headerSettings = null;
			for (let i = 0; i < tableModel.headers.length; i++) {
				const obj = tableModel.headers[i];
				if (obj.id === cell.headerId) {
					header = tableModel.headers[i];
					headerSettings = tableSettings.columns[i];
				}
			}
			const { width, height } = measureElement(
				cell.content,
				headerSettings.useAutoWidth,
				headerSettings.width,
				headerSettings.shouldWrapOverflow
			);
			return {
				rowId: cell.rowId,
				headerId: header.id,
				width,
				height,
			};
		});
	}, [tableModel.cells, tableModel.headers]);

	const rowHeights = useMemo(() => {
		const heights: { [id: string]: number } = {};
		cellSizes.forEach((size) => {
			const { rowId, height } = size;
			if (!heights[rowId] || heights[rowId] < height)
				heights[rowId] = height;
		});
		return Object.fromEntries(
			Object.entries(heights).map((entry) => {
				const [key, value] = entry;
				return [key, numToPx(value)];
			})
		);
	}, [cellSizes]);

	const columnWidths = useMemo(() => {
		const widths: { [id: string]: number } = {};
		cellSizes.forEach((size) => {
			const { headerId, width: cellWidth } = size;
			let width = cellWidth;
			if (width < MIN_COLUMN_WIDTH_PX) width = MIN_COLUMN_WIDTH_PX;
			if (!widths[headerId] || widths[headerId] < width)
				widths[headerId] = width;
		});
		return Object.fromEntries(
			Object.entries(widths).map((entry) => {
				const [key, value] = entry;
				return [key, numToPx(value)];
			})
		);
	}, [cellSizes]);

	return (
		<div id={tableId} className="NLT__app" tabIndex={0}>
			<OptionBar
				headers={tableModel.headers}
				tableSettings={tableSettings}
			/>
			<div className="NLT__table-wrapper">
				<Table
					headers={tableModel.headers.map((header, index) => {
						const {
							width,
							type,
							sortDir,
							shouldWrapOverflow,
							useAutoWidth,
						} = tableSettings.columns[index];
						const { id, content } = header;
						return {
							id,
							component: (
								<EditableTh
									key={id}
									id={id}
									index={index}
									width={findCellWidth(
										type,
										useAutoWidth,
										columnWidths[id],
										width
									)}
									shouldWrapOverflow={shouldWrapOverflow}
									useAutoWidth={useAutoWidth}
									positionUpdateTime={positionUpdateTime}
									content={content}
									type={type}
									sortDir={sortDir}
									numHeaders={tableModel.headers.length}
									onSortSelect={handleHeaderSortSelect}
									onInsertColumnClick={
										handleInsertColumnClick
									}
									onMoveColumnClick={handleMoveColumnClick}
									onWidthChange={handleHeaderWidthChange}
									onDeleteClick={handleDeleteHeaderClick}
									onSaveClick={handleHeaderSave}
									onTypeSelect={handleHeaderTypeSelect}
									onAutoWidthToggle={handleAutoWidthToggle}
									onWrapOverflowToggle={
										handleWrapContentToggle
									}
								/>
							),
						};
					})}
					rows={tableModel.rows.map((row) => {
						return {
							id: row.id,
							component: (
								<>
									{tableModel.headers.map((header, index) => {
										const {
											width,
											type,
											useAutoWidth,
											shouldWrapOverflow,
										} = tableSettings.columns[index];
										const {
											id: cellId,
											content,
											textContent,
										} = tableModel.cells.find(
											(cell) =>
												cell.rowId === row.id &&
												cell.headerId === header.id
										);
										const { id: headerId } = header;
										return (
											<EditableTd
												key={cellId}
												cellId={cellId}
												headerId={headerId}
												content={content}
												textContent={textContent}
												headerType={type}
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
													columnWidths[headerId],
													width
												)}
												height={rowHeights[row.id]}
												tagUpdate={tagUpdate}
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
											height: rowHeights[row.id],
										}}
									>
										<div className="NLT__td-container">
											<RowMenu
												positionUpdateTime={
													positionUpdateTime
												}
												rowId={row.id}
												onDeleteClick={
													handleDeleteRowClick
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
