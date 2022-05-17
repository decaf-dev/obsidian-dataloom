import React, { useEffect, useState, useRef } from "react";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import DragMenu from "./components/DragMenu";
import EditableTh from "./components/EditableTh";

import { initialHeader } from "./services/appData/state/header";
import { initialTag, Tag } from "./services/appData/state/tag";
import { initialRow } from "./services/appData/state/row";
import { initialCell, Cell } from "./services/appData/state/cell";
import { AppData } from "./services/appData/state/appData";
import { NltSettings } from "./services/settings";
import { saveAppData } from "./services/appData/external/save";
import {
	findNextTabbableElement,
	findTabbableElement,
} from "./services/appData/internal/tabbable";
import { TabbableElement } from "./services/appData/state/tabbableElement";

import { CELL_TYPE, TABBABLE_ELEMENT_TYPE, DEBUG } from "./constants";

import "./app.css";
import NltPlugin from "main";
import { SORT } from "./components/HeaderMenu/constants";
import { addRow, addColumn } from "./services/appData/internal/add";
import { randomCellId, randomColumnId, randomRowId } from "./services/random";

interface Props {
	plugin: NltPlugin;
	settings: NltSettings;
	data: AppData;
	sourcePath: string;
	tableId: string;
}

const INITIAL_FOCUSED_ELEMENT = { [-1]: TABBABLE_ELEMENT_TYPE.UNFOCUSED };
export default function App({
	plugin,
	settings,
	data,
	sourcePath,
	tableId,
}: Props) {
	const [oldAppData] = useState<AppData>(data);
	const [appData, setAppData] = useState<AppData>(data);
	// const [focusedElement, setFocusedElement] = useState<TabbableElement>(
	// 	INITIAL_FOCUSED_ELEMENT
	// );
	const [debounceUpdate, setDebounceUpdate] = useState(0);
	const saveLock = useRef(false);

	useEffect(() => {
		// if (DEBUG) console.log("[useEffect] Sorting rows.");
		// const element = settings.focusedElement;
		// setFocusedElement(element);
		//Sort on first render
		//Use case:
		//If a user deletes or adds a new row (by copying and pasting, for example)
		//then we want to make sure that value is sorted in
		// for (let i = 0; i < appData.headers.length; i++) {
		// 	const header = appData.headers[i];
		// 	if (header.sortName !== SORT.DEFAULT.name)
		// 		sortRows(header.id, header.type, header.sortName, false);
		// }
	}, []);

	useEffect(() => {
		async function handleUpdate() {
			//If we're running in Obsidian
			if (app) {
				if (appData.updateTime === 0) return;
				//The save lock ensures that updates only happen after we have pushed our changes
				//to the cache
				if (saveLock.current) return;
				try {
					// await saveAppData(
					// 	plugin,
					// 	settings,
					// 	app,
					// 	oldAppData,
					// 	appData,
					// 	sourcePath,
					// 	tableId
					// );
				} catch (err) {
					console.log(err);
				}
			}
		}

		handleUpdate();
	}, [appData.updateTime, saveLock.current]);

	useEffect(() => {
		let intervalId: NodeJS.Timer = null;
		function startTimer() {
			intervalId = setInterval(() => {
				//When debounce update is called, we will only save after
				//250ms have pass since the last update
				if (Date.now() - debounceUpdate < 250) return;
				clearInterval(intervalId);
				setDebounceUpdate(0);
				setAppData((prevState) => {
					return {
						...prevState,
						updateTime: Date.now(),
					};
				});
			}, 100);
		}
		if (debounceUpdate !== 0) startTimer();
		return () => {
			clearInterval(intervalId);
		};
	}, [debounceUpdate]);

	// useEffect(() => {
	// 	if (saveLock) {
	// 		saveLock.current = false;
	// 	}
	// }, [focusedElement]);

	// function resetFocusedElement() {
	// 	updateFocusedElement(INITIAL_FOCUSED_ELEMENT);
	// }

	// function updateFocusedElement(element: TabbableElement) {
	// 	setFocusedElement(element);
	// 	settings.focusedElement = element;
	// 	plugin.saveSettings();
	// }

	// function handleCellFocusClick(id: string) {
	// 	const element = findTabbableElement(appData, id);
	// 	updateFocusedElement(element);
	// }

	// async function handleKeyUp(e: React.KeyboardEvent) {
	// 	// if (DEBUG) console.log("[handler] handleKeyUp called.");
	// 	if (e.key === "Tab") {
	// 		const prevElement = { ...focusedElement };
	// 		const nextElement = findNextTabbableElement(
	// 			appData,
	// 			prevElement.id
	// 		);
	// 		updateFocusedElement(nextElement);
	// 	}
	// }

	function handleAddColumn() {
		// if (DEBUG) console.log("[handler]: handleAddColumn called.");
		setAppData((prevState) => {
			return addColumn(prevState);
		});
	}

	function handleAddRow() {
		// if (DEBUG) console.log("[handler]: handleAddRow called.");
		setAppData((prevState: AppData) => {
			const newData = addRow(prevState);
			const focusedElement = {
				id: newData.cells[newData.cells.length - newData.headers.length]
					.id,
				type: TABBABLE_ELEMENT_TYPE.CELL,
			};
			settings.focusedElement = focusedElement;
			return newData;
		});
	}

	function handleHeaderSave(id: string, updatedContent: string) {
		// if (DEBUG) console.log("[handler]: handleHeaderSave called.");
		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
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
	}

	function handleHeaderSortSelect(
		id: string,
		type: string,
		sortName: string
	) {
		// if (DEBUG) console.log("[handler]: handleHeaderSort called.");
		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
				headers: prevState.headers.map((header) => {
					if (id === header.id) return { ...header, sortName };
					return { ...header, sortName: SORT.DEFAULT.name };
				}),
			};
		});
		sortRows(id, type, sortName);
	}

	function handleCellContentChange(id: string, content: any) {
		if (DEBUG.APP.HANDLER)
			console.log(`[App]: handleCellContentChange("${id}", ${content}).`);

		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
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
	}

	function handleAddTag(
		cellId: string,
		headerId: string,
		content: string,
		color: string
	) {
		// if (DEBUG) console.log("[handler]: handleAddTag called.");
		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
				tags: [
					...removeTagReferences(prevState.tags, cellId),
					initialTag(headerId, cellId, content, color),
				],
			};
		});
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
		// if (DEBUG) console.log("[handler]: handleTagClick called.");
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
				updateTime: Date.now(),
				tags: arr,
			};
		});
	}

	function handleRemoveTagClick(cellId: string, tagId: string) {
		// if (DEBUG) console.log("[handler]: handleRemoveTagClick called.");
		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
				tags: removeTagReferences(prevState.tags, cellId),
			};
		});
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
				updateTime: shouldUpdate ? Date.now() : 0,
			};
		});
	}

	function handleDeleteHeaderClick(id: string) {
		// if (DEBUG) console.log("[handler]: handleDeleteHeaderClick called.");
		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
				headers: prevState.headers.filter((header) => header.id !== id),
				cells: prevState.cells.filter((cell) => cell.headerId !== id),
			};
		});
	}

	function handleDeleteRowClick(rowId: string) {
		// if (DEBUG) console.log("[handler]: handleDeleteRowClick called.");
		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
				rows: prevState.rows.filter((row) => row.id !== rowId),
				cells: prevState.cells.filter((cell) => cell.rowId !== rowId),
			};
		});
	}

	function handleMoveRowClick(id: string, moveBelow: boolean) {
		// if (DEBUG) console.log("[handler]: handleMoveRowClick called.");
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
				updateTime: Date.now(),
			};
		});
	}

	function handleWidthChange(id: string, newWidth: number) {
		// if (DEBUG) console.log("[handler]: handleWidthChange called.");
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
		// if (DEBUG) console.log("[handler]: handleMoveColumnClick called.");
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
				updateTime: Date.now(),
			};
		});
	}

	function handleInsertColumnClick(id: string, insertRight: boolean) {
		// if (DEBUG) console.log("[handler]: handleInsertColumnClick called.");
		setAppData((prevState: AppData) => {
			const header = prevState.headers.find((header) => header.id === id);
			const index = prevState.headers.indexOf(header);
			const insertIndex = insertRight ? index + 1 : index;
			const headerToInsert = initialHeader(
				randomColumnId(),
				"New Column"
			);

			const cells = prevState.rows.map((row) =>
				initialCell(
					randomCellId(),
					row.id,
					headerToInsert.id,
					headerToInsert.type
				)
			);

			const headers = [...prevState.headers];
			headers.splice(insertIndex, 0, headerToInsert);

			return {
				...prevState,
				updateTime: Date.now(),
				headers,
				cells: [...prevState.cells, ...cells],
			};
		});
	}

	function handleInsertRowClick(id: string, insertBelow = false) {
		// if (DEBUG) console.log("[handler]: handleHeaderInsertRowClick called.");
		const rowId = randomRowId();
		setAppData((prevState: AppData) => {
			const tags: Tag[] = [];

			const cells = prevState.headers.map((header) =>
				initialCell(randomCellId(), rowId, header.id, header.type)
			);

			const rows = [...prevState.rows];

			const index = prevState.rows.findIndex((row) => row.id === id);
			const insertIndex = insertBelow ? index + 1 : index;
			//If you insert a new row, then we want to resort?
			rows.splice(insertIndex, 0, initialRow(rowId, Date.now()));
			return {
				...prevState,
				updateTime: Date.now(),
				rows,
				cells: [...prevState.cells, ...cells],
				tags: [...prevState.tags, ...tags],
			};
		});
	}

	function handleHeaderTypeSelect(id: string, cellType: string) {
		// if (DEBUG) console.log("[handler]: handleHeaderTypeSelect called.");
		//If same header type return
		const header = appData.headers.find((header) => header.id === id);
		if (header.type === cellType) return;

		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
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
	}

	// function handleCellOutsideClick() {
	// 	resetFocusedElement();
	// }

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
				updateTime: Date.now(),
			};
		});
	}

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
											// onFocusClick={handleCellFocusClick}
											// onOutsideClick={
											// 	handleCellOutsideClick
											// }
											// isFocused={
											// 	focusedElement.id === cell.id
											// }
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
									<DragMenu
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
