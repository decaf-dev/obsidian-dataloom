import React, { useEffect, useState } from "react";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import RowMenu from "./components/RowMenu";
import EditableTh from "./components/EditableTh";

import { initialHeader } from "./services/appData/state/header";
import { initialTag, Tag } from "./services/appData/state/tag";
import { initialRow } from "./services/appData/state/row";
import { initialCell, Cell } from "./services/appData/state/cell";
import { AppData } from "./services/appData/state/appData";
import { NltSettings } from "./services/settings";
import { saveAppData } from "./services/appData/external/save";

import { CELL_TYPE, DEBUG } from "./constants";

import "./app.css";
import NltPlugin from "main";
import { SORT } from "./components/HeaderMenu/constants";
import { addRow, addColumn } from "./services/appData/internal/add";
import { findCurrentViewType } from "./services/appData/external/loadUtils";
import { v4 as uuid } from "uuid";
interface Props {
	plugin: NltPlugin;
	settings: NltSettings;
	data: AppData;
	sourcePath: string;
	tableIndex: string;
	el: HTMLElement;
}

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
	const [debounceUpdate, setDebounceUpdate] = useState(0);
	const [updateTime, setUpdateTime] = useState(0);

	function handleAddColumn() {
		if (DEBUG.APP.HANDLER) console.log("[App]: handleAddColumn called.");
		setAppData((prevState) => addColumn(prevState));
		setUpdateTime(Date.now());
	}

	function handleAddRow() {
		if (DEBUG.APP.HANDLER) console.log("[App]: handleAddRow called.");
		setAppData((prevState: AppData) => addRow(prevState));
		setUpdateTime(Date.now());
	}

	function handleHeaderSave(id: string, updatedContent: string) {
		if (DEBUG.APP.HANDLER) console.log("[App]: handleHeaderSave called.");
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
		setUpdateTime(Date.now());
	}

	function handleHeaderSortSelect(
		id: string,
		type: string,
		sortName: string
	) {
		if (DEBUG.APP.HANDLER) console.log("[App]: handleHeaderSort called.");
		setAppData((prevState) => {
			return {
				...prevState,
				headers: prevState.headers.map((header) => {
					if (id === header.id) return { ...header, sortName };
					return { ...header, sortName: SORT.DEFAULT.name };
				}),
			};
		});
		sortRows(id, type, sortName);
	}

	function handleCellContentChange(id: string, content: any) {
		if (DEBUG.APP.HANDLER) {
			console.log(`[App]: handleCellContentChange`);
			console.log({ id, content });
		}

		setAppData((prevState) => {
			return {
				...prevState,
				cells: prevState.cells.map((cell: Cell) => {
					if (cell.id === id) {
						return initialCell(
							cell.id,
							cell.rowId,
							cell.headerId,
							cell.type,
							content
						);
					}
					return cell;
				}),
			};
		});
		setUpdateTime(Date.now());
	}

	function handleAddTag(
		cellId: string,
		headerId: string,
		content: string,
		color: string
	) {
		if (DEBUG.APP.HANDLER) console.log("[App]: handleAddTag called.");
		setAppData((prevState) => {
			return {
				...prevState,
				tags: [
					...removeTagReferences(prevState.tags, cellId),
					initialTag(headerId, cellId, content, color),
				],
			};
		});
		setUpdateTime(Date.now());
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
		if (DEBUG.APP.HANDLER) console.log("[App]: handleTagClick called.");
		//If our cell id has already selected the tag then return
		const found = appData.tags.find((tag) => tag.id === tagId);
		if (found.selected.includes(cellId)) return;

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
		setUpdateTime(Date.now());
	}

	function handleRemoveTagClick(cellId: string, tagId: string) {
		if (DEBUG.APP.HANDLER)
			console.log("[App]: handleRemoveTagClick called.");
		setAppData((prevState) => {
			return {
				...prevState,
				tags: removeTagReferences(prevState.tags, cellId),
			};
		});
		setUpdateTime(Date.now());
	}

	function sortRows(
		headerId: string,
		headerType: string,
		sortName: string,
		shouldUpdate = true
	) {
		setAppData((prevState) => {
			//Create a new array because the sort function mutates
			//the original array
			const arr = [...prevState.rows];
			arr.sort((a, b) => {
				const cellA = appData.cells.find(
					(cell) => cell.headerId === headerId && cell.rowId === a.id
				);
				const cellB = appData.cells.find(
					(cell) => cell.headerId === headerId && cell.rowId === b.id
				);
				if (sortName === SORT.ASC.name) {
					if (headerType === CELL_TYPE.TAG) {
						const tagA = appData.tags.find((tag) =>
							tag.selected.includes(cellA.id)
						);
						const tagB = appData.tags.find((tag) =>
							tag.selected.includes(cellB.id)
						);
						return tagA.content.localeCompare(tagB.content);
					} else {
						return cellA.toString().localeCompare(cellB.toString());
					}
				} else if (sortName === SORT.DESC.name) {
					if (headerType === CELL_TYPE.TAG) {
						const tagA = appData.tags.find((tag) =>
							tag.selected.includes(cellA.id)
						);
						const tagB = appData.tags.find((tag) =>
							tag.selected.includes(cellB.id)
						);
						return tagB.content.localeCompare(tagA.content);
					} else {
						return cellB.toString().localeCompare(cellA.toString());
					}
				} else {
					//Otherwise sort on when the row was added
					return a.creationTime - b.creationTime;
				}
			});
			return {
				...prevState,
				rows: arr,
			};
		});
		if (shouldUpdate) setUpdateTime(Date.now());
	}

	function handleDeleteHeaderClick(id: string) {
		if (DEBUG.APP.HANDLER)
			console.log("[App]: handleDeleteHeaderClick called.");
		setAppData((prevState) => {
			return {
				...prevState,
				headers: prevState.headers.filter((header) => header.id !== id),
				cells: prevState.cells.filter((cell) => cell.headerId !== id),
			};
		});
		setUpdateTime(Date.now());
	}

	function handleDeleteRowClick(rowId: string) {
		if (DEBUG.APP.HANDLER)
			console.log("[App]: handleDeleteRowClick called.");
		setAppData((prevState) => {
			return {
				...prevState,
				rows: prevState.rows.filter((row) => row.id !== rowId),
				cells: prevState.cells.filter((cell) => cell.rowId !== rowId),
			};
		});
		setUpdateTime(Date.now());
	}

	function handleMoveRowClick(id: string, moveBelow: boolean) {
		if (DEBUG.APP.HANDLER) console.log("[App]: handleMoveRowClick called.");
		setAppData((prevState: AppData) => {
			const index = prevState.rows.findIndex((row) => row.id === id);
			//We assume that there is checking to make sure you don't move the first row up or last row down
			const moveIndex = moveBelow ? index + 1 : index - 1;
			const rows = [...prevState.rows];

			//Swap values
			const oldTime = rows[moveIndex].creationTime;
			const newTime = rows[index].creationTime;
			const old = rows[moveIndex];
			rows[moveIndex] = rows[index];
			rows[moveIndex].creationTime = oldTime;
			rows[index] = old;
			rows[index].creationTime = newTime;

			return {
				...prevState,
				rows,
			};
		});
		setUpdateTime(Date.now());
	}

	function handleWidthChange(id: string, newWidth: number) {
		if (DEBUG.APP.HANDLER) console.log("[App]: handleWidthChange called.");
		setAppData((prevState: AppData) => {
			return {
				...prevState,
				headers: prevState.headers.map((header) => {
					if (header.id === id) {
						return {
							...header,
							width: `${newWidth}px`,
						};
					}
					return header;
				}),
			};
		});
		setDebounceUpdate(Date.now());
	}

	function handleMoveColumnClick(id: string, moveRight: boolean) {
		if (DEBUG.APP.HANDLER)
			console.log("[App]: handleMoveColumnClick called.");
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
		setUpdateTime(Date.now());
	}

	function handleInsertColumnClick(id: string, insertRight: boolean) {
		if (DEBUG.APP.HANDLER)
			console.log("[App]: handleInsertColumnClick called.");
		setAppData((prevState: AppData) => {
			const header = prevState.headers.find((header) => header.id === id);
			const index = prevState.headers.indexOf(header);
			const insertIndex = insertRight ? index + 1 : index;
			const headerToInsert = initialHeader(uuid(), "New Column");

			const cells = prevState.rows.map((row) =>
				initialCell(
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
		setUpdateTime(Date.now());
	}

	function handleInsertRowClick(id: string, insertBelow = false) {
		if (DEBUG.APP.HANDLER)
			console.log("[App]: handleHeaderInsertRowClick called.");
		const rowId = uuid();
		setAppData((prevState: AppData) => {
			const tags: Tag[] = [];

			const cells = prevState.headers.map((header) =>
				initialCell(uuid(), rowId, header.id, header.type)
			);

			const rows = [...prevState.rows];

			const index = prevState.rows.findIndex((row) => row.id === id);
			const insertIndex = insertBelow ? index + 1 : index;
			//If you insert a new row, then we want to resort?
			rows.splice(insertIndex, 0, initialRow(rowId, Date.now()));
			return {
				...prevState,
				rows,
				cells: [...prevState.cells, ...cells],
				tags: [...prevState.tags, ...tags],
			};
		});
		setUpdateTime(Date.now());
	}

	function handleHeaderTypeSelect(id: string, cellType: string) {
		if (DEBUG.APP.HANDLER)
			console.log("[App]: handleHeaderTypeSelect called.");
		//If same header type return
		const header = appData.headers.find((header) => header.id === id);
		if (header.type === cellType) return;

		setAppData((prevState) => {
			return {
				...prevState,
				//Update header to new cell type
				headers: prevState.headers.map((header) => {
					if (id === header.id) return { ...header, type: cellType };
					return header;
				}),

				//Update cell that matches header id to the new cell type
				cells: prevState.cells.map((cell) => {
					if (cell.headerId === id) {
						return initialCell(
							cell.id,
							cell.rowId,
							cell.headerId,
							cellType
						);
					}
					return cell;
				}),
			};
		});
		setUpdateTime(Date.now());
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
		setUpdateTime(Date.now());
	}

	useEffect(() => {
		// Sort on first render
		// If a user deletes or adds a new row (by copying and pasting, for example)
		// then we want to make sure that value is sorted in
		for (let i = 0; i < appData.headers.length; i++) {
			const header = appData.headers[i];
			if (header.sortName !== SORT.DEFAULT.name)
				sortRows(header.id, header.type, header.sortName, false);
		}
	}, []);

	useEffect(() => {
		async function handleUpdate() {
			if (updateTime === 0) return;
			try {
				await saveAppData(
					plugin,
					settings,
					app,
					oldAppData,
					appData,
					sourcePath,
					tableIndex,
					findCurrentViewType(el)
				);
			} catch (err) {
				console.log(err);
			}
		}

		handleUpdate();
	}, [updateTime]);

	useEffect(() => {
		let intervalId: NodeJS.Timer = null;
		function startTimer() {
			intervalId = setInterval(() => {
				//When debounce update is called, we will only save after
				//250ms have pass since the last update
				if (Date.now() - debounceUpdate < 250) return;
				clearInterval(intervalId);
				setDebounceUpdate(0);
				setUpdateTime(Date.now());
			}, 100);
		}
		if (debounceUpdate !== 0) startTimer();
		return () => clearInterval(intervalId);
	}, [debounceUpdate]);

	// const [previewStyle, setPreviewStyle] = useState({
	// 	viewWidth: 0,
	// 	sizerWidth: 0,
	// });

	// useEffect(() => {
	// 	// setTimeout(() => {
	// 	const viewEl = document.querySelector(".markdown-preview-view");
	// 	const sizerEl = document.querySelector(".markdown-preview-sizer");
	// 	if (viewEl instanceof HTMLElement && sizerEl instanceof HTMLElement) {
	// 		const viewWidth =
	// 			parseInt(
	// 				window
	// 					.getComputedStyle(viewEl)
	// 					.getPropertyValue("width")
	// 					.split("px")[0]
	// 			) - 60;

	// 		const sizerWidth = parseInt(
	// 			window
	// 				.getComputedStyle(sizerEl)
	// 				.getPropertyValue("width")
	// 				.split("px")[0]
	// 		);

	// 		setPreviewStyle({
	// 			viewWidth,
	// 			sizerWidth,
	// 		});
	// 	}
	// 	// }, 1);
	// }, [resizeTime]);

	// const [tableWidth, setTableWidth] = useState(0);
	// const didMount = useRef(false);
	// const tableRef = useCallback(
	// 	(node) => {
	// 		function updateWidth() {
	// 			if (node) {
	// 				if (node instanceof HTMLElement) {
	// 					console.log(node.offsetWidth);
	// 					setTableWidth(node.offsetWidth);
	// 				}
	// 			}
	// 			if (!didMount.current) didMount.current = true;
	// 		}
	// 		if (didMount.current) updateWidth();
	// 		else setTimeout(() => updateWidth(), 1);
	// 	},
	// );

	// useEffect(() => {
	// 	let el: HTMLElement | null = null;
	// 	function handleResize() {
	// 		setResizeTime(Date.now());
	// 	}
	// 	setTimeout(() => {
	// 		handleResize();
	// 		el = document.querySelector(".view-content");
	// 		new ResizeObserver(handleResize).observe(el);
	// 	}, 1);
	// }, []);

	// // console.log("tableWidth", tableWidth);
	// const margin = previewStyle.viewWidth - previewStyle.sizerWidth;
	// //The margin can be 0 when the window is small
	// if (tableWidth <= previewStyle.sizerWidth || margin === 0) {
	// 	//This will set the width to the size of the preview, being a max-width of 700px
	// 	style = {
	// 		left: "0px",
	// 		width: "100%",
	// 	};
	// } else if (tableWidth <= previewStyle.viewWidth) {
	// 	const calculatedMargin = previewStyle.viewWidth - tableWidth;
	// 	const BUTTON_WIDTH = 30;
	// 	style = {
	// 		left: `-${calculatedMargin / 2 - BUTTON_WIDTH}px`,
	// 		width: `${tableWidth}px`,
	// 	};
	// } else {
	// 	console.log(`-${margin / 2}px`);
	// 	style = {
	// 		left: `-${margin / 2}px`,
	// 		width: `calc(100% + ${margin}px)`,
	// 	};
	// }

	//If a table updates in editing mode or reading mode, update the other table
	//TODO change with notifier in the main.js
	//TODO why doesn't this always update?
	useEffect(() => {
		let intervalId: NodeJS.Timer = null;
		function startTimer() {
			intervalId = setInterval(async () => {
				if (settings.state[sourcePath]) {
					if (settings.state[sourcePath][tableIndex]) {
						const { shouldUpdate, viewType } =
							settings.state[sourcePath][tableIndex];

						const currentViewType = findCurrentViewType(el);

						if (shouldUpdate && viewType !== currentViewType) {
							clearInterval(intervalId);
							settings.state[sourcePath][
								tableIndex
							].shouldUpdate = false;
							await plugin.saveSettings();
							const savedData =
								settings.state[sourcePath][tableIndex].data;
							setOldAppData(savedData);
							setAppData(savedData);
							startTimer();
						}
					}
				}
			}, 500);
		}
		startTimer();
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="NLT__app" tabIndex={0}>
			<Table
				headers={appData.headers.map((header, j) => {
					const { id, content, width, type, sortName } = header;
					return {
						...header,
						component: (
							<EditableTh
								key={id}
								id={id}
								width={width}
								index={j}
								content={content}
								type={type}
								sortName={sortName}
								inFirstHeader={j === 0}
								inLastHeader={j === appData.headers.length - 1}
								onSortSelect={handleHeaderSortSelect}
								onInsertColumnClick={handleInsertColumnClick}
								onMoveColumnClick={handleMoveColumnClick}
								onWidthChange={handleWidthChange}
								onDeleteClick={handleDeleteHeaderClick}
								onSaveClick={handleHeaderSave}
								onTypeSelect={handleHeaderTypeSelect}
							/>
						),
					};
				})}
				rows={appData.rows.map((row, i) => {
					return {
						...row,
						component: (
							<>
								{appData.headers.map((header, j) => {
									const cell = appData.cells.find(
										(cell) =>
											cell.rowId === row.id &&
											cell.headerId === header.id
									);
									return (
										<EditableTd
											key={cell.id}
											cell={cell}
											width={header.width}
											tags={appData.tags.filter(
												(tag) =>
													tag.headerId === header.id
											)}
											onTagClick={handleTagClick}
											onRemoveTagClick={
												handleRemoveTagClick
											}
											onContentChange={
												handleCellContentChange
											}
											onColorChange={handleChangeColor}
											onAddTag={handleAddTag}
										/>
									);
								})}
								<td className="NLT__td">
									<RowMenu
										rowId={row.id}
										isFirstRow={i === 0}
										isLastRow={
											i === appData.rows.length - 1
										}
										onMoveRowClick={handleMoveRowClick}
										onDeleteClick={handleDeleteRowClick}
										onInsertRowClick={handleInsertRowClick}
									/>
								</td>
							</>
						),
					};
				})}
				onAddColumn={handleAddColumn}
				onAddRow={handleAddRow}
			/>
		</div>
	);
}
