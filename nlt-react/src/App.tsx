import React, { useState } from "react";

import { v4 as uuidv4 } from "uuid";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import ArrowGroup from "./components/ArrowGroup";
import DragMenu from "./components/DragMenu";
import HeaderMenu from "./components/HeaderMenu";

import { CELL_TYPE, ARROW } from "./constants";
import "./app.css";

export default function App() {
	const initialHeader = (content, position) => {
		return {
			id: uuidv4(),
			position,
			content,
			arrow: ARROW.NONE,
			width: "15rem",
			type: CELL_TYPE.TEXT,
		};
	};

	const initialCell = (type = CELL_TYPE.TEXT) => {
		return {
			id: uuidv4(),
			text: "",
			tags: [],
			type,
		};
	};

	const initialClickedHeader = {
		left: 0,
		top: 0,
		id: 0,
		position: 0,
		content: "",
		type: CELL_TYPE.TEXT,
	};

	const [headers, setHeaders] = useState([initialHeader("Column", 0)]);
	const [rows, setRows] = useState([]);

	const [clickedHeader, setClickedHeader] = useState(initialClickedHeader);

	function handleAddColumn() {
		//Add a new initial header
		setHeaders((prevState) => [
			...prevState,
			initialHeader("Column", headers.length),
		]);

		//Add a new cell to each existing row
		setRows((prevState) =>
			prevState.map((row) => {
				return {
					...row,
					cells: [...row.cells, initialCell()],
				};
			})
		);
	}

	function handleAddRow() {
		setRows((prevState) => [
			...prevState,
			{
				id: uuidv4(),
				cells: headers.map((header) => initialCell(header.type)),
				time: Date.now(),
			},
		]);
	}

	function handleHeaderClick(e, id, position, content, type) {
		//Only open on header div click
		if (e.target.nodeName !== "DIV") return;

		const { x, y, height } = e.target.getBoundingClientRect();
		setClickedHeader({
			left: x,
			top: y + height,
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

	function handleHeaderArrowClick(id, position, arrow) {
		//Set header arrow
		setHeaders((prevState) =>
			prevState.map((header) => {
				if (id === header.id) return { ...header, arrow };
				return { ...header, arrow: ARROW.NONE };
			})
		);
		//Sort rows based off the arrow selection
		sortRows(position, arrow);
	}

	function handleCellSave(
		rowId,
		headerPosition,
		updatedContent,
		updatedTags
	) {
		setRows((prevState) =>
			prevState.map((row) => {
				if (row.id === rowId)
					return {
						...row,
						cells: row.cells.map((c, i) => {
							//This makes the assumption that the cell index
							//will always make the header position
							if (i === headerPosition) {
								return {
									...c,
									text: updatedContent,
									tags: updatedTags,
								};
							}
							return c;
						}),
					};
				return row;
			})
		);
	}

	function sortRows(headerPosition, arrow) {
		//TODO fix for tags
		// setRows((prevState) => {
		// 	//Create a new array because the sort function mutates
		// 	//the original array
		// 	const arr = [...prevState];
		// 	return arr.sort((a, b) => {
		// 		const cellA = a.cells[headerPosition];
		// 		const cellB = b.cells[headerPosition];
		// 		//Sort based on content if arrow is selected
		// 		if (arrow === ARROW.UP) {
		// 			return cellB.content.localeCompare(cellA.content);
		// 		} else if (arrow === ARROW.DOWN) {
		// 			return cellA.content.localeCompare(cellB.content);
		// 			//Otherwise sort on when the row was added
		// 		} else {
		// 			return a.time - b.time;
		// 		}
		// 	});
		// });
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
		setRows((prevState) =>
			prevState.map((row) => {
				return {
					...row,
					cells: row.cells.filter((cell, i) => i !== position),
				};
			})
		);
	}

	function handleDeleteRowClick(rowId) {
		setRows(rows.filter((row) => row.id !== rowId));
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
		setRows((prevState) =>
			prevState.map((row) => {
				const cells = row.cells.map((cell, i) => {
					if (i === headerPosition)
						return {
							...cell,
							type: cellType,
							text: "",
							tags: [],
						};
					return cell;
				});
				return {
					...row,
					cells,
				};
			})
		);
	}

	//Find all cell tags that don't belong to the cell
	function findCellTags(id) {
		const tags = [];
		rows.forEach((row) => {
			row.cells.forEach((cell) => {
				if (cell.id === id) return;
				cell.tags.forEach((tag) => {
					if (!tag.selected) return;
					const find = tags.find(
						(t) =>
							t.content.toLowerCase() ===
							tag.content.toLowerCase()
					);
					if (!find) {
						tags.push({
							...tag,
							selected: false,
						});
					}
				});
			});
		});
		return tags;
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
								{headers.map((header, i) => (
									<EditableTd
										key={header.id}
										id={row.cells[i].id}
										type={row.cells[i].type}
										oldText={row.cells[i].text}
										oldTags={row.cells[i].tags}
										width={header.width}
										findCellTags={findCellTags}
										onSaveClick={(
											updatedContent,
											updatedTags
										) =>
											handleCellSave(
												row.id,
												header.position,
												updatedContent,
												updatedTags
											)
										}
									/>
								))}
								<td></td>
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
