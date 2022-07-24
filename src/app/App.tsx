import React, { useEffect, useState, useMemo, useRef } from "react";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import EditableTh from "./components/EditableTh";
import OptionBar from "./components/OptionBar";

import { initialHeader } from "./services/appData/state/header";
import { initialTag, Tag } from "./services/appData/state/tag";
import { initialRow } from "./services/appData/state/row";
import { Cell } from "./services/appData/state/cell";
import { AppData } from "./services/appData/state/appData";
import { NltSettings } from "./services/settings";
import { saveAppData } from "./services/appData/external/save";
import { numToPx, pxToNum } from "./services/string/parsers";

import { CONTENT_TYPE, DEBUG, MIN_COLUMN_WIDTH_PX } from "./constants";

import "./app.css";
import NltPlugin from "main";
import { SortDir } from "./services/sort/types";
import { addRow, addColumn } from "./services/appData/internal/add";
import {
	findCurrentViewType,
	findNewCell,
} from "./services/appData/external/loadUtils";
import { v4 as uuid } from "uuid";
import { logFunc } from "./services/appData/debug";
import { useScrollUpdate } from "./services/hooks";
import { sortAppDataForSave } from "./services/appData/external/saveUtils";

interface Props {
	plugin: NltPlugin;
	settings: NltSettings;
	data: AppData;
	sourcePath: string;
	tableIndex: string;
	el: HTMLElement;
}

const COMPONENT_NAME = "App";

export default function App({
	plugin,
	settings,
	data,
	sourcePath,
	tableIndex,
	el,
}: Props) {
	const [oldAppData, setOldAppData] = useState<AppData>(data);
	const [appData, setAppData] = useState<AppData>(data);
	const [tableId] = useState(uuid());
	const [debounceUpdate, setDebounceUpdate] = useState(0);
	const [tagUpdate, setTagUpdate] = useState({
		time: 0,
		cellId: "",
	});
	const [sortUpdateTime, setSortUpdateTime] = useState(0);
	const [saveTime, setSaveTime] = useState(0);
	const [headerWidthUpdateTime, setHeaderWidthUpdateTime] = useState(0);

	useEffect(() => {
		sortUpdate();
	}, []);

	useEffect(() => {
		async function handleUpdate() {
			if (saveTime === 0) return;
			try {
				console.log("SAVING!");
				const oldData = sortAppDataForSave(oldAppData);
				const newData = sortAppDataForSave(appData);
				await saveAppData(
					plugin,
					settings,
					app,
					oldData,
					newData,
					sourcePath,
					tableIndex,
					findCurrentViewType(el)
				);
			} catch (err) {
				console.log(err);
			}
		}

		handleUpdate();
	}, [saveTime]);

	useEffect(() => {
		let intervalId: NodeJS.Timer = null;
		function startTimer() {
			intervalId = setInterval(() => {
				//When debounce update is called, we will only save after
				//250ms have pass since the last update
				if (Date.now() - debounceUpdate < 250) return;
				clearInterval(intervalId);
				setDebounceUpdate(0);
				saveData();
			}, 100);
		}
		if (debounceUpdate !== 0) startTimer();
		return () => clearInterval(intervalId);
	}, [debounceUpdate]);

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
	// 						setOldAppData(savedData);
	// 						setAppData(savedData);
	// 						startTimer();
	// 					}
	// 				}
	// 			}
	// 		}, 500);
	// 	}
	// 	startTimer();
	// 	return () => clearInterval(intervalId);
	// }, []);

	function saveData() {
		setSaveTime(Date.now());
	}

	function sortUpdate() {
		sortRows();
		setSortUpdateTime(Date.now());
	}

	function handleAddColumn() {
		if (DEBUG.APP) console.log("[App]: handleAddColumn called.");
		setAppData((prevState) => addColumn(prevState));
		saveData();
	}

	function handleAddRow() {
		if (DEBUG.APP) console.log("[App]: handleAddRow called.");
		setAppData((prevState: AppData) => addRow(prevState));
		saveData();
	}

	function handleHeaderSave(id: string, updatedContent: string) {
		if (DEBUG.APP) console.log("[App]: handleHeaderSave called.");
		setAppData((prevState) => {
			return {
				...prevState,
				headers: prevState.headers.map((header) => {
					if (header.id === id)
						return {
							...header,
							content: updatedContent,
						};
					return header;
				}),
			};
		});
		saveData();
	}

	function handleHeaderTypeSelect(id: string, cellType: string) {
		if (DEBUG.APP) console.log("[App]: handleHeaderTypeSelect called.");
		//If same header type return
		const header = appData.headers.find((header) => header.id === id);
		if (header.type === cellType) return;

		//Handle tags
		setAppData((prevState) => {
			return {
				...prevState,
				//Update header to new cell type
				headers: prevState.headers.map((header) => {
					if (id === header.id) return { ...header, type: cellType };
					return header;
				}),
				cells: prevState.cells.map((cell: Cell) => {
					if (cell.headerId === id) {
						let content = cell.toString();
						if (cellType === CONTENT_TYPE.CHECKBOX) content = "[ ]";
						return findNewCell(
							cell.id,
							cell.rowId,
							cell.headerId,
							cellType,
							content
						);
					}
					return cell;
				}),
			};
		});
		saveData();
	}

	function handleHeaderSortSelect(
		id: string,
		type: string,
		sortDir: SortDir
	) {
		if (DEBUG.APP) console.log("[App]: handleHeaderSort called.");
		setAppData((prevState) => {
			return {
				...prevState,
				headers: prevState.headers.map((header) => {
					if (id === header.id) return { ...header, sortDir };
					return { ...header, sortDir: SortDir.DEFAULT };
				}),
			};
		});
		sortUpdate();
		saveData();
	}

	function handleCellContentSave() {
		saveData();
	}

	function handleCellContentChange(
		id: string,
		headerType: string,
		content: any,
		isCheckbox = false
	) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleCellContentChange", {
				id,
				headerType,
				content,
			});
		}

		setAppData((prevState) => {
			return {
				...prevState,
				cells: prevState.cells.map((cell: Cell) => {
					if (cell.id === id) {
						//While a column's content type is chosen by the user
						//in the header menu. The cell content type
						//is based off of the actual cell content string.
						//Each time we update the content value, we want to recalculate the
						//content type.
						return findNewCell(
							cell.id,
							cell.rowId,
							cell.headerId,
							headerType,
							content
						);
					}
					return cell;
				}),
			};
		});

		//TODO refactor
		if (isCheckbox) {
			saveData();
		}
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
		setAppData((prevState) => {
			return {
				...prevState,
				tags: [
					...removeTagReferences(prevState.tags, cellId),
					initialTag(uuid(), headerId, cellId, content, color),
				],
			};
		});
		setTagUpdate({ cellId, time: Date.now() });
	}

	/**
	 * Removes tag references for a specified cell id
	 * @param tags The tag array
	 * @param cellId The cell id
	 * @returns An array of tags with selected arrays that do not contain the specific cell id
	 */
	function removeTagReferences(tags: Tag[], cellId: string) {
		return tags
			.map((tag) => {
				return {
					...tag,
					selected: tag.selected.filter(
						(id: string) => id !== cellId
					),
				};
			})
			.filter((tag) => tag.selected.length !== 0);
	}

	function handleTagClick(cellId: string, tagId: string) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleTagClick", {
				cellId,
				tagId,
			});
		}
		//If our cell id has already selected the tag then return
		const found = appData.tags.find((tag) => tag.id === tagId);
		if (!found.selected.includes(cellId)) {
			let arr = removeTagReferences(appData.tags, cellId);
			arr = arr.map((tag) => {
				//Add cell id to selected list
				if (tag.id === tagId) {
					return {
						...tag,
						selected: [...tag.selected, cellId],
					};
				}
				return tag;
			});

			setAppData((prevState) => {
				return {
					...prevState,
					tags: arr,
				};
			});
		}
		setTagUpdate({ cellId, time: Date.now() });
	}

	function handleRemoveTagClick(cellId: string) {
		if (DEBUG.APP) console.log("[App]: handleRemoveTagClick called.");
		setAppData((prevState) => {
			return {
				...prevState,
				tags: removeTagReferences(prevState.tags, cellId),
			};
		});
	}

	function handleDeleteHeaderClick(id: string) {
		if (DEBUG.APP) console.log("[App]: handleDeleteHeaderClick called.");
		setAppData((prevState) => {
			return {
				...prevState,
				headers: prevState.headers.filter((header) => header.id !== id),
				cells: prevState.cells.filter((cell) => cell.headerId !== id),
			};
		});
		saveData();
	}

	function handleDeleteRowClick(rowId: string) {
		if (DEBUG.APP) console.log("[App]: handleDeleteRowClick called.");
		setAppData((prevState) => {
			return {
				...prevState,
				rows: prevState.rows.filter((row) => row.id !== rowId),
				cells: prevState.cells.filter((cell) => cell.rowId !== rowId),
			};
		});
		saveData();
	}

	function handleMoveRowClick(id: string, moveBelow: boolean) {
		if (DEBUG.APP) console.log("[App]: handleMoveRowClick called.");
		setAppData((prevState: AppData) => {
			const index = prevState.rows.findIndex((row) => row.id === id);
			//We assume that there is checking to make sure you don't move the first row up or last row down
			const moveIndex = moveBelow ? index + 1 : index - 1;
			const rows = [...prevState.rows];

			//Swap values
			const oldIndex = rows[moveIndex].initialIndex;
			const oldTime = rows[moveIndex].creationTime;
			const newIndex = rows[index].initialIndex;
			const newTime = rows[index].creationTime;

			const old = rows[moveIndex];
			rows[moveIndex] = rows[index];
			rows[moveIndex].creationTime = oldTime;
			rows[moveIndex].initialIndex = oldIndex;
			rows[index] = old;
			rows[index].creationTime = newTime;
			rows[index].initialIndex = newIndex;

			return {
				...prevState,
				rows,
			};
		});
		saveData();
	}

	function handleHeaderWidthChange(id: string, width: string) {
		if (DEBUG.APP) {
			logFunc(COMPONENT_NAME, "handleHeaderWidthChange", {
				id,
				width,
			});
		}
		setAppData((prevState: AppData) => {
			return {
				...prevState,
				headers: prevState.headers.map((header) => {
					if (header.id === id) {
						return {
							...header,
							width,
						};
					}
					return header;
				}),
			};
		});
		setHeaderWidthUpdateTime(Date.now());
		setDebounceUpdate(Date.now());
	}

	function handleMoveColumnClick(id: string, moveRight: boolean) {
		if (DEBUG.APP) console.log("[App]: handleMoveColumnClick called.");
		setAppData((prevState: AppData) => {
			const index = prevState.headers.findIndex(
				(header) => header.id === id
			);
			const moveIndex = moveRight ? index + 1 : index - 1;
			const headers = [...prevState.headers];

			//Swap values
			const old = headers[moveIndex];
			headers[moveIndex] = headers[index];
			headers[index] = old;
			return {
				...prevState,
				headers,
			};
		});
		saveData();
	}

	function handleInsertColumnClick(id: string, insertRight: boolean) {
		if (DEBUG.APP) console.log("[App]: handleInsertColumnClick called.");
		setAppData((prevState: AppData) => {
			const header = prevState.headers.find((header) => header.id === id);
			const index = prevState.headers.indexOf(header);
			const insertIndex = insertRight ? index + 1 : index;
			const headerToInsert = initialHeader(uuid(), "New Column");

			const cells = prevState.rows.map((row) =>
				findNewCell(
					uuid(),
					row.id,
					headerToInsert.id,
					headerToInsert.type
				)
			);

			const headers = [...prevState.headers];
			headers.splice(insertIndex, 0, headerToInsert);

			return {
				...prevState,
				headers,
				cells: [...prevState.cells, ...cells],
			};
		});
		saveData();
	}

	function handleInsertRowClick(id: string, insertBelow = false) {
		if (DEBUG.APP) console.log("[App]: handleHeaderInsertRowClick called.");
		const rowId = uuid();
		setAppData((prevState: AppData) => {
			const tags: Tag[] = [];

			const cells = prevState.headers.map((header) =>
				findNewCell(uuid(), rowId, header.id, header.type)
			);

			const rows = [...prevState.rows];

			const index = prevState.rows.findIndex((row) => row.id === id);
			const insertIndex = insertBelow ? index + 1 : index;
			//If you insert a new row, then we want to resort?
			rows.splice(
				insertIndex,
				0,
				initialRow(rowId, insertIndex, Date.now())
			);
			return {
				...prevState,
				rows,
				cells: [...prevState.cells, ...cells],
				tags: [...prevState.tags, ...tags],
			};
		});
		saveData();
	}

	function handleChangeColor(tagId: string, color: string) {
		setAppData((prevState) => {
			return {
				...prevState,
				tags: prevState.tags.map((tag) => {
					if (tag.id === tagId) {
						return {
							...tag,
							color,
						};
					}
					return tag;
				}),
			};
		});
		saveData();
	}

	function handleAutoWidthToggle(headerId: string, value: boolean) {
		setAppData((prevState) => {
			return {
				...prevState,
				headers: prevState.headers.map((header) => {
					if (header.id === headerId) {
						return {
							...header,
							useAutoWidth: value,
						};
					}
					return header;
				}),
			};
		});
	}

	function handleWrapContentToggle(headerId: string, value: boolean) {
		setAppData((prevState) => {
			return {
				...prevState,
				headers: prevState.headers.map((header) => {
					if (header.id === headerId) {
						return {
							...header,
							shouldWrapOverflow: value,
						};
					}
					return header;
				}),
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
		ruler.textContent = textContent;

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
		if (cellType !== CONTENT_TYPE.TEXT && cellType !== CONTENT_TYPE.NUMBER)
			return headerWidth;
		//If we're not using auto width, just use the width that we set for the column
		if (useAutoWidth) return calculatedWidth;
		return headerWidth;
	}

	function sortRows() {
		setAppData((prevState) => {
			const header = prevState.headers.find(
				(header) => header.sortDir !== SortDir.DEFAULT
			);
			if (header) {
				const { id, sortDir, type } = header;
				const arr = [...prevState.rows];
				arr.sort((a, b) => {
					const cellA = appData.cells.find(
						(cell) => cell.headerId === id && cell.rowId === a.id
					);
					const cellB = appData.cells.find(
						(cell) => cell.headerId === id && cell.rowId === b.id
					);
					const contentA = cellA.toString();
					const contentB = cellB.toString();

					if (sortDir !== SortDir.DEFAULT) {
						//Force empty cells to the bottom
						if (contentA === "" && contentB !== "") return 1;
						if (contentA !== "" && contentB === "") return -1;
						if (contentA === "" && contentB === "") return 0;
					}

					if (sortDir === SortDir.ASC) {
						if (type === CONTENT_TYPE.TAG) {
							const tagA = appData.tags.find((tag) =>
								tag.selected.includes(cellA.id)
							);
							const tagB = appData.tags.find((tag) =>
								tag.selected.includes(cellB.id)
							);
							return tagA.content.localeCompare(tagB.content);
						} else {
							return contentA.localeCompare(contentB);
						}
					} else if (sortDir === SortDir.DESC) {
						if (type === CONTENT_TYPE.TAG) {
							const tagA = appData.tags.find((tag) =>
								tag.selected.includes(cellA.id)
							);
							const tagB = appData.tags.find((tag) =>
								tag.selected.includes(cellB.id)
							);
							return tagB.content.localeCompare(tagA.content);
						} else {
							return contentB.localeCompare(contentA);
						}
					} else {
						const creationA = a.creationTime;
						const creationB = b.creationTime;
						if (creationA > creationB) return 1;
						if (creationA < creationB) return -1;
						return 0;
					}
				});
				return {
					...prevState,
					rows: arr,
				};
			}
			return prevState;
		});
	}

	const cellSizes = useMemo(() => {
		return appData.cells.map((cell) => {
			const header = appData.headers.find(
				(header) => header.id === cell.headerId
			);
			const { width, height } = measureElement(
				cell.toString(),
				header.useAutoWidth,
				header.width,
				header.shouldWrapOverflow
			);
			return {
				rowId: cell.rowId,
				headerId: header.id,
				width,
				height,
			};
		});
	}, [appData.cells, appData.headers]);

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

	const {
		scrollTime: tableScrollUpdateTime,
		handleScroll: handleTableScroll,
	} = useScrollUpdate(150);

	const isSorted = appData.headers.find(
		(header) => header.sortDir !== SortDir.DEFAULT
	)
		? true
		: false;

	return (
		<div id={tableId} className="NLT__app" tabIndex={0}>
			<OptionBar headers={appData.headers} />
			<div onScroll={handleTableScroll}>
				<Table
					headers={appData.headers.map((header, columnIndex) => {
						const {
							id,
							content,
							width,
							type,
							sortDir,
							shouldWrapOverflow,
							useAutoWidth,
						} = header;
						return {
							id,
							component: (
								<EditableTh
									key={id}
									id={id}
									width={findCellWidth(
										type,
										useAutoWidth,
										columnWidths[id],
										width
									)}
									shouldWrapOverflow={shouldWrapOverflow}
									useAutoWidth={useAutoWidth}
									headerWidthUpdateTime={
										headerWidthUpdateTime
									}
									tableScrollUpdateTime={
										tableScrollUpdateTime
									}
									sortUpdateTime={sortUpdateTime}
									index={columnIndex}
									content={content}
									type={type}
									sortDir={sortDir}
									isFirstChild={columnIndex === 0}
									isLastChild={
										columnIndex ===
										appData.headers.length - 1
									}
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
					rows={appData.rows.map((row, rowIndex) => {
						return {
							id: row.id,
							component: (
								<>
									{appData.headers.map((header) => {
										const cell = appData.cells.find(
											(cell) =>
												cell.rowId === row.id &&
												cell.headerId === header.id
										);
										const {
											id: headerId,
											type,
											useAutoWidth,
											width,
										} = header;
										return (
											<EditableTd
												key={cell.id}
												cell={cell}
												headerType={header.type}
												tableScrollUpdateTime={
													tableScrollUpdateTime
												}
												headerWidthUpdateTime={
													headerWidthUpdateTime
												}
												sortUpdateTime={sortUpdateTime}
												shouldWrapOverflow={
													header.shouldWrapOverflow
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
												tags={appData.tags.filter(
													(tag) =>
														tag.headerId ===
														header.id
												)}
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
										style={{ height: rowHeights[row.id] }}
									>
										<div className="NLT__td-container">
											<RowMenu
												hideInsertOptions={isSorted}
												hideMoveOptions={isSorted}
												tableScrollUpdateTime={
													tableScrollUpdateTime
												}
												headerWidthUpdateTime={
													headerWidthUpdateTime
												}
												sortUpdateTime={sortUpdateTime}
												rowId={row.id}
												isFirstRow={rowIndex === 0}
												isLastRow={
													rowIndex ===
													appData.rows.length - 1
												}
												onMoveRowClick={
													handleMoveRowClick
												}
												onDeleteClick={
													handleDeleteRowClick
												}
												onInsertRowClick={
													handleInsertRowClick
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
