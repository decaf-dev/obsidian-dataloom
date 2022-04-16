import React, { useEffect, useState, useRef } from "react";

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
import { useApp } from "./services/hooks";
import { AppData } from "./services/state";

import { CELL_TYPE, DEBUG } from "./constants";

import "./app.css";
import NltPlugin from "main";
import { SORT } from "./components/HeaderMenu/constants";

interface Props {
	plugin: NltPlugin;
	settings: NltSettings;
	data: AppData;
	sourcePath: string;
}

export default function App({ plugin, settings, data, sourcePath }: Props) {
	const [oldAppData, setOldAppData] = useState<AppData>(data);
	const [appData, setAppData] = useState<AppData>(data);
	const appRef = useRef<HTMLInputElement>();

	const app = useApp();

	if (DEBUG) {
		console.log("ROWS", appData.rows);
		console.log("CELLS", appData.cells);
		console.log("TAGS", appData.tags);
	}

	useEffect(() => {
		async function handleUpdate() {
			//If we're running in Obsidian
			if (app) {
				if (appData.updateTime !== 0) {
					if (DEBUG) console.log("Saving Data");
					try {
						await saveAppData(
							plugin,
							settings,
							app,
							oldAppData,
							appData,
							sourcePath
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
			const cells = [...prevState.cells];
			prevState.rows.forEach((row) => {
				cells.push(
					initialCell(
						uuidv4(),
						row.id,
						prevState.headers.length,
						CELL_TYPE.TEXT,
						""
					)
				);
			});
			return {
				...prevState,
				updateTime: Date.now(),
				headers: [
					...prevState.headers,
					initialHeader("Column", prevState.headers.length),
				],
				cells,
			};
		});
	}

	function handleAddRow() {
		const rowId = uuidv4();
		setAppData((prevState: AppData) => {
			return {
				...prevState,
				updateTime: Date.now(),
				rows: [...prevState.rows, initialRow(rowId)],
				cells: [
					...prevState.cells,
					...prevState.headers.map((header, i) =>
						initialCell(uuidv4(), rowId, i, header.type, "")
					),
				],
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
		position: number,
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
		sortRows(position, type, sortName);
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
		headerId: string,
		cellId: string,
		content: string,
		color: string
	) {
		// const tag = appData.tags.find((tag) => tag.content === text);
		// if (tag) {
		// 	//If our cell id has already selected the tag then return
		// 	if (tag.selected.includes(cellId)) return;
		// 	//Otherwise select our cell id
		// 	setAppData((prevState) => {
		// 		const arr = removeTagReferences(prevState.tags, cellId);
		// 		return {
		// 			...prevState,
		// 			updateTime: Date.now(),
		// 			tags: arr.map((tag) => {
		// 				if (tag.content === text) {
		// 					return {
		// 						...tag,
		// 						selected: [...tag.selected, cellId],
		// 					};
		// 				}
		// 				return tag;
		// 			}),
		// 		};
		// 	});
		// } else {
		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
				tags: [
					...removeTagReferences(prevState.tags, cellId),
					initialTag(content, cellId, headerId, color),
				],
			};
		});
		//}
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
		headerPosition: number,
		headerType: string,
		sortName: string
	) {
		setAppData((prevState) => {
			//Create a new array because the sort function mutates
			//the original array
			const arr = [...prevState.rows];
			arr.sort((a, b) => {
				const cellA = appData.cells.find(
					(cell) =>
						cell.position === headerPosition && cell.rowId === a.id
				);
				const cellB = appData.cells.find(
					(cell) =>
						cell.position === headerPosition && cell.rowId === b.id
				);
				if (sortName === SORT.DESC.name) {
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
				} else if (sortName === SORT.ASC.name) {
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
				updateTime: Date.now(),
			};
		});
	}

	function handleDeleteHeaderClick(id: string, position: number) {
		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
				headers: prevState.headers
					.filter((header) => header.id !== id)
					.map((header) => {
						if (header.position > position) {
							return {
								...header,
								position: header.position - 1,
							};
						}
						return header;
					}),
				cells: prevState.cells
					.filter((cell) => cell.position !== position)
					.map((cell) => {
						if (cell.position > position) {
							return {
								...cell,
								position: cell.position - 1,
							};
						}
						return cell;
					}),
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

	function handleHeaderTypeSelect(
		headerId: string,
		headerPosition: number,
		cellType: string
	) {
		//If same header type return
		const header = appData.headers.find((header) => header.id === headerId);
		if (header.type === cellType) return;

		setAppData((prevState) => {
			return {
				...prevState,
				updateTime: Date.now(),
				//Update header to new cell type
				headers: prevState.headers.map((header) => {
					if (headerId === header.id)
						return { ...header, type: cellType };
					return header;
				}),
				//Update cell that matches header id to the new cell type
				cells: prevState.cells.map((cell) => {
					if (cell.position === headerPosition) {
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
		<div className="NLT__overflow" ref={appRef}>
			<Table
				headers={appData.headers.map((header) => {
					const { id, content, position, type, sortName } = header;
					return {
						...header,
						component: (
							<EditableTh
								key={id}
								id={id}
								content={content}
								position={position}
								type={type}
								sortName={sortName}
								onSortSelect={handleHeaderSortSelect}
								onDeleteClick={handleDeleteHeaderClick}
								onSaveClick={handleHeaderSave}
								onTypeSelect={handleHeaderTypeSelect}
							/>
						),
					};
				})}
				rows={appData.rows.map((row) => {
					return {
						...row,
						component: (
							<>
								{appData.headers.map((header, index) => {
									const { id, type, content, expectedType } =
										appData.cells.find(
											(cell) =>
												cell.rowId === row.id &&
												cell.position === index
										);
									return (
										<EditableTd
											key={id}
											headerId={header.id}
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
											width={header.width}
											onUpdateContent={
												handleUpdateContent
											}
											onAddTag={handleAddTag}
										/>
									);
								})}
								<td className="NLT__td">
									<DragMenu
										onDeleteClick={() =>
											handleDeleteRowClick(row.id)
										}
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
