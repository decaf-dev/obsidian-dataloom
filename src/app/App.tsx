import React, { useState } from "react";

import { v4 as uuidv4 } from "uuid";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import ArrowGroup from "./components/ArrowGroup";
import DragMenu from "./components/DragMenu";
import HeaderMenu from "./components/HeaderMenu";

import {
	initialHeader,
	initialCell,
	initialHeaderMenuState,
	initialRow,
	initialTag,
	Tag,
} from "./services/state";
import { AppData } from "./services/dataUtils";
import { useApp } from "./services/utils";

import { ARROW, CELL_TYPE, DEBUG } from "./constants";

import "./app.css";

interface Props {
	data: AppData;
}

export default function App({ data }: Props) {
	const [headers, setHeaders] = useState(data.headers);
	const [rows, setRows] = useState(data.rows);
	const [cells, setCells] = useState(data.cells);
	const [tags, setTags] = useState(data.tags);

	const [headerMenu, setHeaderMenu] = useState(initialHeaderMenuState);

	//We use the shortcircuit operator if we're developing using react-scripts
	const { workspace } = useApp() || {};

	if (DEBUG) {
		console.log("ROWS", rows);
		console.log("CELLS", cells);
		console.log("TAGS", tags);
	}

	function handleAddColumn() {
		//Add a new initial header
		setHeaders((prevState) => [
			...prevState,
			initialHeader("Column", headers.length),
		]);

		//Add a new cell to each existing row
		setCells((prevState) => {
			const arr = [...prevState];
			rows.forEach((row) => {
				arr.push(
					initialCell(
						uuidv4(),
						row.id,
						headers.length,
						CELL_TYPE.TEXT
					)
				);
			});
			return arr;
		});
	}

	function handleAddRow() {
		const rowId = uuidv4();
		setRows((prevState) => [...prevState, initialRow(rowId)]);
		setCells((prevState) => [
			...prevState,
			...headers.map((header, i) =>
				initialCell(uuidv4(), rowId, i, header.type)
			),
		]);
	}

	function handleHeaderClick(
		e: React.MouseEvent<HTMLDivElement>,
		id: string,
		position: number,
		content: string,
		type: string
	) {
		const target = e.target as HTMLDivElement;

		let fileExplorerWidth = 0;
		let ribbonWidth = 0;

		//Check if defined, it will be undefined if we're developing using react-scripts
		//and not rendering in Obsidian
		if (workspace) {
			const el = workspace.containerEl;
			const ribbon = el.getElementsByClassName(
				"workspace-ribbon"
			)[0] as HTMLElement;
			const fileExplorer = el.getElementsByClassName(
				"workspace-split"
			)[0] as HTMLElement;

			fileExplorerWidth = fileExplorer.offsetWidth;
			ribbonWidth = ribbon.offsetWidth;
		}

		const { x, y } = target.getBoundingClientRect();

		setHeaderMenu({
			isOpen: true,
			left: x - fileExplorerWidth - ribbonWidth - 12,
			top: y + 11,
			id,
			position,
			content,
			type,
		});
	}

	function handleHeaderSave(id: string, updatedContent: string) {
		setHeaders((prevState) =>
			prevState.map((header) => {
				if (header.id === id)
					return {
						...header,
						content: updatedContent,
					};
				return header;
			})
		);
	}

	function handleHeaderArrowClick(
		id: string,
		position: number,
		type: string,
		arrow: string
	) {
		//Set header arrow
		setHeaders((prevState) =>
			prevState.map((header) => {
				if (id === header.id) return { ...header, arrow };
				return { ...header, arrow: ARROW.NONE };
			})
		);
		//Sort rows based off the arrow selection
		sortRows(position, type, arrow);
	}

	function handleUpdateContent(id: string, content: string) {
		setCells((prevState) =>
			prevState.map((cell) => {
				if (cell.id === id) {
					return {
						...cell,
						content,
					};
				}
				return cell;
			})
		);
	}

	function handleAddTag(cellId: string, text: string, color: string) {
		const tag = tags.find((tag) => tag.content === text);
		if (tag) {
			//If our cell id has already selected the tag then return
			if (tag.selected.includes(cellId)) return;
			//Otherwise select our cell id
			setTags((prevState) => {
				const arr = removeTagReferences(prevState, cellId);
				return arr.map((tag) => {
					if (tag.content === text) {
						return {
							...tag,
							selected: [...tag.selected, cellId],
						};
					}
					return tag;
				});
			});
		} else {
			//If tag doesn't exist, add it
			setTags((prevState) => {
				const arr = removeTagReferences(prevState, cellId);
				return [...arr, initialTag(text, cellId, color)];
			});
		}
	}

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
		const found = tags.find((tag) => tag.id === tagId);
		if (found.selected.includes(cellId)) return;

		setTags((prevState) => {
			const arr = removeTagReferences(prevState, cellId);
			return arr.map((tag) => {
				//Add cell id to selected list
				if (tag.id === tagId) {
					return {
						...tag,
						selected: [...tag.selected, cellId],
					};
				}
				return tag;
			});
		});
	}

	function handleRemoveTagClick(cellId: string, tagId: string) {
		setTags((prevState) => removeTagReferences(prevState, cellId));
	}

	function sortRows(
		headerPosition: number,
		headerType: string,
		arrow: string
	) {
		setRows((prevState) => {
			//Create a new array because the sort function mutates
			//the original array
			const arr = [...prevState];
			return arr.sort((a, b) => {
				const cellA = cells.find(
					(cell) =>
						cell.position === headerPosition && cell.rowId === a.id
				);
				const cellB = cells.find(
					(cell) =>
						cell.position === headerPosition && cell.rowId === b.id
				);
				//Sort based on content if arrow is selected
				if (arrow === ARROW.UP) {
					if (headerType === CELL_TYPE.TAG) {
						const tagA = tags.find((tag) =>
							tag.selected.includes(cellA.id)
						);
						const tagB = tags.find((tag) =>
							tag.selected.includes(cellB.id)
						);
						return tagA.content.localeCompare(tagB.content);
					} else {
						return cellA.content.localeCompare(cellB.content);
					}
				} else if (arrow === ARROW.DOWN) {
					if (headerType === CELL_TYPE.TAG) {
						const tagA = tags.find((tag) =>
							tag.selected.includes(cellA.id)
						);
						const tagB = tags.find((tag) =>
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
		});
	}

	function handleDeleteHeaderClick(id: string, position: number) {
		setHeaders((prevState) =>
			prevState
				.filter((header) => header.id !== id)
				.map((header) => {
					if (header.position > position) {
						return {
							...header,
							position: header.position - 1,
						};
					}
					return header;
				})
		);
		setCells((prevState) =>
			prevState
				.filter((cell) => cell.position !== position)
				.map((cell) => {
					if (cell.position > position) {
						return {
							...cell,
							position: cell.position - 1,
						};
					}
					return cell;
				})
		);
	}

	function handleDeleteRowClick(rowId: string) {
		setRows(rows.filter((row) => row.id !== rowId));
		setCells(cells.filter((cell) => cell.rowId !== rowId));
	}

	function handleMenuItemClick(
		headerId: string,
		headerPosition: number,
		cellType: string
	) {
		//If same header type return
		const header = headers.find((header) => header.id === headerId);
		if (header.type === cellType) return;

		//Update header to new cell type
		setHeaders((prevState) =>
			prevState.map((header) => {
				if (headerId === header.id)
					return { ...header, type: cellType };
				return header;
			})
		);
		//Update cell that matches header id to the new cell type
		setCells((prevState) =>
			prevState.map((cell) => {
				if (cell.position === headerPosition) {
					return {
						...cell,
						type: cellType,
						text: "",
					};
				}
				return cell;
			})
		);
		setTags([]);
	}

	return (
		<div>
			<Table
				headers={headers.map((header) => {
					return {
						...header,
						component: (
							<div className="NLT__header-group">
								<div className="NLT__header-content">
									{header.content}
								</div>
								<ArrowGroup
									selected={header.arrow}
									onArrowClick={(arrow) =>
										handleHeaderArrowClick(
											header.id,
											header.position,
											header.type,
											arrow
										)
									}
								/>
							</div>
						),
						onClick: (e: React.MouseEvent<HTMLDivElement>) =>
							handleHeaderClick(
								e,
								header.id,
								header.position,
								header.content,
								header.type
							),
					};
				})}
				rows={rows.map((row) => {
					return {
						...row,
						component: (
							<>
								{headers.map((header, index) => {
									const { id, type, content } = cells.find(
										(cell) =>
											cell.rowId === row.id &&
											cell.position === index
									);
									return (
										<EditableTd
											key={id}
											cellId={id}
											type={type}
											content={content}
											tags={tags}
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
								<div className="NLT__td"></div>
								<DragMenu
									onDeleteClick={() =>
										handleDeleteRowClick(row.id)
									}
								/>
							</>
						),
					};
				})}
				onAddColumn={handleAddColumn}
				onAddRow={handleAddRow}
			/>
			<HeaderMenu
				hide={headerMenu.isOpen === false}
				style={{
					top: headerMenu.top,
					left: headerMenu.left,
				}}
				id={headerMenu.id}
				content={headerMenu.content}
				position={headerMenu.position}
				type={headerMenu.type}
				onOutsideClick={handleHeaderSave}
				onItemClick={handleMenuItemClick}
				onDeleteClick={handleDeleteHeaderClick}
				onClose={() => setHeaderMenu(initialHeaderMenuState)}
			/>
		</div>
	);
}
