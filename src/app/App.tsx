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
	initialClickedHeader,
	initialRow,
	initialTag,
} from "./services/utils";

import { ARROW, CELL_TYPE, DEBUG } from "./constants";
import "./app.css";
import { useApp } from "./services/utils";

export default function App() {
	const [headers, setHeaders] = useState([initialHeader("Column", 0)]);
	const [rows, setRows] = useState([]);
	const [cells, setCells] = useState([]);
	const [tags, setTags] = useState([]);
	const [clickedHeader, setClickedHeader] = useState(initialClickedHeader);

	const { workspace } = useApp();

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
				arr.push(initialCell(row.id, headers.length));
			});
			return arr;
		});
	}

	if (DEBUG) {
		console.log("ROWS", rows);
		console.log("CELLS", cells);
		console.log("TAGS", tags);
	}

	function handleAddRow() {
		const id = uuidv4();
		setRows((prevState) => [...prevState, initialRow(id)]);
		setCells((prevState) => [
			...prevState,
			...headers.map((header, i) => initialCell(id, i, header.type)),
		]);
	}

	function handleHeaderClick(e, id, position, content, type) {
		//Only open on header div click
		if (e.target.className !== "NLT__header-content") return;

		const el = workspace.containerEl;
		const ribbon = el.getElementsByClassName("workspace-ribbon")[0];
		const fileExplorer = el.getElementsByClassName("workspace-split")[0];
		const { x, y, height } = e.target.getBoundingClientRect();

		setClickedHeader({
			left: x - fileExplorer.offsetWidth - ribbon.offsetWidth - 12,
			top: y + 11,
			id,
			position,
			content,
			type,
		});
	}

	function handleHeaderSave(id, updatedContent) {
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

	function handleHeaderArrowClick(id, position, type, arrow) {
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

	function handleSaveText(id, text) {
		setCells((prevState) =>
			prevState.map((cell) => {
				if (cell.id === id) {
					return {
						...cell,
						text,
					};
				}
				return cell;
			})
		);
	}

	function handleAddTag(cellId, text) {
		let tag = tags.find((tag) => tag.content === text);
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
				return [...arr, initialTag(text, cellId)];
			});
		}
	}

	function removeTagReferences(tags, cellId) {
		return tags
			.map((tag) => {
				return {
					...tag,
					selected: tag.selected.filter((id) => id !== cellId),
				};
			})
			.filter((tag) => tag.selected.length !== 0);
	}

	function handleTagClick(cellId, tagId) {
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

	function handleRemoveTagClick(cellId, tagId) {
		setTags((prevState) => removeTagReferences(prevState, cellId));
	}

	function sortRows(headerPosition, headerType, arrow) {
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
						return cellA.text.localeCompare(cellB.text);
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
						return cellB.text.localeCompare(cellA.text);
					}
				} else {
					//Otherwise sort on when the row was added
					return a.time - b.time;
				}
			});
		});
	}

	function handleDeleteHeaderClick(id, position) {
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

	function handleDeleteRowClick(rowId) {
		setRows(rows.filter((row) => row.id !== rowId));
		setCells(cells.filter((cell) => cell.rowId !== rowId));
	}

	function handleMenuItemClick(headerId, headerPosition, cellType) {
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
						id: header.id,
						content: (
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
						width: header.width,
						onClick: (e) =>
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
						id: row.id,
						content: (
							<>
								<DragMenu
									onDeleteClick={() =>
										handleDeleteRowClick(row.id)
									}
								/>
								{headers.map((header, index) => {
									const { id, type, text } = cells.find(
										(cell) =>
											cell.rowId === row.id &&
											cell.position === index
									);
									return (
										<EditableTd
											key={id}
											cellId={id}
											type={type}
											text={text}
											tags={tags}
											onTagClick={handleTagClick}
											onRemoveTagClick={
												handleRemoveTagClick
											}
											width={header.width}
											onSaveText={handleSaveText}
											onAddTag={handleAddTag}
										/>
									);
								})}
								<div className="NLT__td"></div>
							</>
						),
					};
				})}
				onAddColumn={handleAddColumn}
				onAddRow={handleAddRow}
			/>
			<HeaderMenu
				hide={clickedHeader.left === 0}
				style={{
					top: clickedHeader.top,
					left: clickedHeader.left,
				}}
				id={clickedHeader.id}
				content={clickedHeader.content}
				position={clickedHeader.position}
				type={clickedHeader.type}
				onOutsideClick={handleHeaderSave}
				onItemClick={handleMenuItemClick}
				onDeleteClick={handleDeleteHeaderClick}
				onClose={() => setClickedHeader(initialClickedHeader)}
			/>
		</div>
	);
}
