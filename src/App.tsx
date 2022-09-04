import React, { useEffect, useState, useMemo } from "react";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import EditableTh from "./components/EditableTh";
import OptionBar from "./components/OptionBar";

import {
	initialHeader,
	initialTag,
	initialCell,
} from "./services/appData/state/initialState";
import { Cell, AppData, Tag } from "./services/appData/state/types";
import { saveAppData } from "./services/appData/external/save";
import { numToPx, pxToNum } from "./services/string/parsers";

import { CONTENT_TYPE, DEBUG, MIN_COLUMN_WIDTH_PX } from "./constants";

import "./app.css";
import NltPlugin from "main";
import { SortDir } from "./services/sort/types";
import { addRow, addColumn } from "./services/appData/internal/add";
import { findCurrentViewType } from "./services/appData/external/loadUtils";
import { v4 as uuid } from "uuid";
import { logFunc } from "./services/appData/debug";
import {
	useCloseMenusOnScroll,
	useDidMountEffect,
	useId,
	useSaveTime,
} from "./services/hooks";
import { sortRows } from "./services/sort/sort";
import { MarkdownSectionInformation } from "obsidian";

interface Props {
	plugin: NltPlugin;
	loadedData: AppData;
	sourcePath: string;
	blockId: string;
	sectionInfo: MarkdownSectionInformation;
	el: HTMLElement;
}

const COMPONENT_NAME = "App";

export default function App({
	plugin,
	loadedData,
	sourcePath,
	blockId,
	sectionInfo,
	el,
}: Props) {
	const [appData, setAppData] = useState<AppData>(loadedData);
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
		//TODO handle when a user clicks the same option
		setAppData((prevState) => {
			return {
				...prevState,
				rows: sortRows(prevState),
			};
		});
		forcePositionUpdate();
		saveData();
	}, [sortTime]);

	useDidMountEffect(() => {
		async function handleUpdate() {
			try {
				await saveAppData(
					plugin,
					appData,
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

	function sortData() {
		setSortTime(Date.now());
	}

	function forcePositionUpdate() {
		setPositionUpdateTime(Date.now());
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

	function handleHeaderTypeSelect(id: string, selectedCellType: string) {
		if (DEBUG.APP) console.log("[App]: handleHeaderTypeSelect called.");
		//If same header type return
		const header = appData.headers.find((header) => header.id === id);
		if (header.type === selectedCellType) return;

		//Handle tags
		setAppData((prevState) => {
			return {
				...prevState,
				//Update header to new cell type
				headers: prevState.headers.map((header) => {
					if (id === header.id)
						return { ...header, type: selectedCellType };
					return header;
				}),
				cells: prevState.cells.map((cell: Cell) => {
					if (cell.headerId === id) {
						return initialCell(
							cell.id,
							cell.headerId,
							cell.rowId,
							selectedCellType,
							cell.content
						);
					}
					return cell;
				}),
			};
		});
		saveData();
	}

	function handleHeaderSortSelect(id: string, sortDir: SortDir) {
		if (DEBUG.APP) console.log("[App]: handleHeaderSort called.");
		setAppData((prevState) => {
			return {
				...prevState,
				headers: prevState.headers.map((header) => {
					if (id === header.id) return { ...header, sortDir };
					return { ...header, sortDir: SortDir.NONE };
				}),
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
		content: string
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
						return initialCell(
							cell.id,
							cell.headerId,
							cell.rowId,
							headerType,
							content
						);
					}
					return cell;
				}),
			};
		});
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
		sortData();
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
		sortData();
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
		forcePositionUpdate();
		saveData(true);
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
				initialCell(
					uuid(),
					headerToInsert.id,
					row.id,
					headerToInsert.type,
					""
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

	const cellSizes = useMemo(() => {
		return appData.cells.map((cell) => {
			const header = appData.headers.find(
				(header) => header.id === cell.headerId
			);
			const { width, height } = measureElement(
				cell.content,
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

	return (
		<div id={tableId} className="NLT__app" tabIndex={0}>
			<OptionBar headers={appData.headers} />
			<div className="NLT__table-wrapper">
				<Table
					headers={appData.headers.map((header, i) => {
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
									positionUpdateTime={positionUpdateTime}
									index={i}
									content={content}
									type={type}
									sortDir={sortDir}
									numHeaders={appData.headers.length}
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
					rows={appData.rows.map((row) => {
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
												positionUpdateTime={
													positionUpdateTime
												}
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
