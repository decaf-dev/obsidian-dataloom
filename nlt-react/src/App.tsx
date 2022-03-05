import React, { useState, useRef } from "react";

import { v4 as uuidv4 } from "uuid";

import EditableTd from "./components/EditableTd";
import Table from "./components/Table";
import ArrowGroup from "./components/ArrowGroup";
import DragMenu from "./components/DragMenu";

import { ARROW } from "./components/ArrowGroup/constants";

import "./app.css";
import HeaderMenu from "./components/HeaderMenu";

export default function App() {
	const initialHeader = (id, content = "Column") => {
		return { id, content, arrow: ARROW.NONE, width: "15rem" };
	};

	const initialCell = (id, content = "") => {
		return { id, content };
	};

	const [headers, setHeaders] = useState([initialHeader(0)]);
	const [rows, setRows] = useState([]);

	const initialClickedHeader = {
		left: 0,
		top: 0,
		id: 0,
		content: "",
	};

	const [clickedHeader, setClickedHeader] = useState(initialClickedHeader);

	function handleAddColumn() {
		setHeaders((prevState) => [
			...prevState,
			initialHeader(headers.length),
		]);

		setRows((prevState) =>
			prevState.map((row) => {
				return {
					...row,
					cells: [...row.cells, initialCell(row.cells.length)],
				};
			})
		);
	}

	function handleAddRow() {
		setRows((prevState) => [
			...prevState,
			{
				id: uuidv4(),
				cells: headers.map((i) => initialCell(i)),
			},
		]);
	}

	function handleHeaderClick(e, id, content) {
		if (e.target.nodeName !== "DIV") return;

		const { x, y, height } = e.target.getBoundingClientRect();
		setClickedHeader({
			left: x,
			top: y + height,
			id,
			content,
		});
	}

	function handleHeaderSave(id, updatedContent) {
		const arr = [...headers];
		const header = headers.filter((header) => header.id === id)[0];
		const index = headers.indexOf(header);
		arr[index] = { ...header, content: updatedContent };
		setHeaders(arr);
		setClickedHeader(initialClickedHeader);
	}

	function handleArrowClick(headerId, arrow) {
		setHeaders((prevState) =>
			prevState.map((header) => {
				if (headerId === header.id) return { ...header, arrow };
				return { ...header, arrow: ARROW.NONE };
			})
		);
		sortRows(headerId, arrow);
	}

	function handleCellSave(cell) {
		console.log(cell);
		setRows((prevState) => {
			const arr = [...prevState];
			return arr.map((row) => {
				if (row.id === cell.rowId) {
					const arr2 = [...row.cells];
					arr2[cell.cellId] = initialCell(cell.cellId, cell.value);
					return {
						...row,
						cells: arr2,
					};
				}
				return row;
			});
		});
	}

	function sortRows(cellId, arrow) {
		setRows((prevState) => {
			const arr = [...prevState];
			return arr.sort((a, b) => {
				const cellA = a.cells[cellId];
				const cellB = b.cells[cellId];

				if (arrow === ARROW.UP) {
					return cellB.content.localeCompare(cellA.content);
				} else if (arrow === ARROW.DOWN) {
					return cellA.content.localeCompare(cellB.content);
				} else {
					return a.id - b.id;
				}
			});
		});
	}

	function handleDeleteClick(rowId) {
		setRows(rows.filter((row) => row.id !== rowId));
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
										handleArrowClick(header.id, arrow)
									}
								/>
							</div>
						),
						width: header.width,
						onClick: (e) =>
							handleHeaderClick(e, header.id, header.content),
					};
				})}
				rows={rows.map((row) => {
					return {
						id: row.id,
						content: (
							<>
								<DragMenu
									onDeleteClick={() =>
										handleDeleteClick(row.id)
									}
								/>
								{headers.map((header, i) => (
									<EditableTd
										key={header.id}
										content={row.cells[i].content}
										width={header.width}
										rowId={row.id}
										cellId={header.id}
										onSaveClick={handleCellSave}
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
				onOutsideClick={handleHeaderSave}
			/>
		</div>
	);
}
