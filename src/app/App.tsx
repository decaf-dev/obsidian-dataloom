import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import DragMenu from "./components/DragMenu";
import EditableTh from "./components/EditableTh";

import {
	initialHeader,
	initialCell,
	initialRow,
	initialTag,
	Tag,
	NltSettings,
} from "./services/state";
import { saveAppData } from "./services/dataUtils";
import { AppData } from "./services/state";

import { CELL_TYPE } from "./constants";

import "./app.css";
import NltPlugin from "main";
import { SORT } from "./components/HeaderMenu/constants";

interface Props {
	plugin: NltPlugin;
	settings: NltSettings;
	data: AppData;
	sourcePath: string;
	tableId: string;
}

export default function App({
	plugin,
	settings,
	data,
	sourcePath,
	tableId,
}: Props) {
	const [oldAppData] = useState<AppData>(data);
	const [appData, setAppData] = useState<AppData>(data);

	useEffect(() => {
		//Sort on first render
		//Use case:
		//If a user deletes or adds a new row (by copying and pasting, for example)
		//then we want to make sure that value is sorted in

		for (let i = 0; i < appData.headers.length; i++) {
			const header = appData.headers[i];
			if (header.sortName !== SORT.DEFAULT.name)
				sortRows(header.id, header.type, header.sortName, false);
		}
	}, []);

	useEffect(() => {
		async function handleUpdate() {
			//If we're running in Obsidian
			if (app) {
				if (appData.updateTime !== 0) {
					try {
						await saveAppData(
							plugin,
							settings,
							app,
							oldAppData,
							appData,
							sourcePath,
							tableId
						);
					} catch (err) {
						console.log(err);
					}
				}
			}
		}
		handleUpdate();
	}, [appData.updateTime]);

	function handleAddColumn() {
		setAppData((prevState) => {
			const header = initialHeader(`Column ${prevState.headers.length}`);
			const cells = [...prevState.cells];
			prevState.rows.forEach((row) => {
				cells.push(
					initialCell(uuidv4(), row.id, header.id, CELL_TYPE.TEXT, "")
				);
			});
			return {
				...prevState,
				updateTime: Date.now(),
				headers: [...prevState.headers, header],
				cells,
			};
		});
	}

	function handleAddRow() {
		const rowId = uuidv4();
		setAppData((prevState: AppData) => {
			const tags: Tag[] = [];
			const cells = prevState.headers.map((header, i) => {
				const cellId = uuidv4();
				if (header.type === CELL_TYPE.TAG)
					tags.push(initialTag(header.id, cellId, "", ""));
				return initialCell(cellId, rowId, header.id, header.type, "");
			});
			return {
				...prevState,
				updateTime: Date.now(),
				rows: [...prevState.rows, initialRow(rowId, Date.now())],
				cells: [...prevState.cells, ...cells],
				tags: [...prevState.tags, ...tags],
			};
		});
	}

	function handleHeaderSave(id: string, updatedContent: string) {
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

	function handleUpdateContent(id: string, content: string) {
		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
				cells: prevState.cells.map((cell) => {
					if (cell.id === id) {
						return {
							...cell,
							content,
						};
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
						return cellA.content.localeCompare(cellB.content);
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
						return cellB.content.localeCompare(cellA.content);
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
				updateTime: Date.now(),
			};
		});
	}

	function handleMoveColumnClick(id: string, moveRight: boolean) {
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
		setAppData((prevState: AppData) => {
			const header = prevState.headers.find((header) => header.id === id);
			const index = prevState.headers.indexOf(header);
			const insertIndex = insertRight ? index + 1 : index;
			const headerToInsert = initialHeader(`Column ${insertIndex + 1}`);

			const cells = prevState.rows.map((row) =>
				initialCell(
					uuidv4(),
					row.id,
					headerToInsert.id,
					headerToInsert.type,
					""
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
		const rowId = uuidv4();
		setAppData((prevState: AppData) => {
			const tags: Tag[] = [];

			const cells = prevState.headers.map((header) => {
				const cellId = uuidv4();
				if (header.type === CELL_TYPE.TAG)
					tags.push(initialTag(header.id, cellId, "", ""));
				return initialCell(cellId, rowId, header.id, header.type, "");
			});

			const rows = [...prevState.rows];

			const index = prevState.rows.findIndex((row) => row.id === id);
			const insertIndex = insertBelow ? index + 1 : index;
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
						return {
							...cell,
							type: cellType,
							content: "",
						};
					}
					return cell;
				}),
			};
		});
	}

	return (
		<div className="NLT__app">
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
									const {
										id,
										type,
										headerId,
										content,
										expectedType,
									} = appData.cells.find(
										(cell) =>
											cell.rowId === row.id &&
											cell.headerId === header.id
									);
									return (
										<EditableTd
											key={id}
											headerId={headerId}
											width={header.width}
											cellId={id}
											type={type}
											content={content}
											expectedType={expectedType}
											tags={appData.tags.filter(
												(tag) =>
													tag.headerId === header.id
											)}
											onTagClick={handleTagClick}
											onRemoveTagClick={
												handleRemoveTagClick
											}
											onUpdateContent={
												handleUpdateContent
											}
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
