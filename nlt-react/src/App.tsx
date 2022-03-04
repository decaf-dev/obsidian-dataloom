import React, { useState } from "react";

import EditableTd from "./components/EditableTd";
import HeaderMenu from "./components/Menu";

import "./app.css";

export default function App() {
	const initialHeader = (id) => {
		return { id, content: "Column", width: "5rem" };
	};

	const [headers, setHeaders] = useState([initialHeader(0)]);

	const [rows, setRows] = useState([]);

	const initialClickedHeaderState = {
		clicked: false,
		left: 0,
		top: 0,
		id: 0,
		content: "",
	};

	const [clickedHeader, setClickedHeader] = useState(
		initialClickedHeaderState
	);

	function handleAddColumn() {
		setHeaders((prevState) => [
			...prevState,
			initialHeader(headers.length),
		]);
	}

	function handleAddRow() {
		setRows((prevState) => [
			...prevState,
			Object.fromEntries(headers.map((header) => ["id", header.id])),
		]);
	}

	function handleHeaderClick(e, id, content) {
		const { x, y, height } = e.target.getBoundingClientRect();
		setClickedHeader({
			clicked: true,
			left: x,
			top: y + height,
			id,
			content,
		});
	}

	function handleOutsideClick(id, text) {
		let arr = [...headers];
		arr = arr.filter((header) => header.id !== id);
		arr.push({ ...initialHeader(id), content: text });
		setHeaders(arr);
		setClickedHeader(initialClickedHeaderState);
	}

	return (
		<div>
			<table className="NLT__Table">
				<thead>
					<tr>
						{headers.map((header) => (
							<th
								key={header.id}
								onClick={(e) =>
									handleHeaderClick(
										e,
										header.id,
										header.content
									)
								}
							>
								{header.content}
							</th>
						))}
						<th>
							<button onClick={handleAddColumn}>New</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => {
						return (
							<tr key={i}>
								{headers.map((header, j) => (
									<EditableTd
										key={header.id}
										width={header.width}
										rowId={row.id}
										cellId={header.id}
										onSaveClick={() => {}}
									/>
								))}
								<td></td>
							</tr>
						);
					})}
				</tbody>
				<tfoot>
					<tr>
						<td>
							<button onClick={handleAddRow}>New</button>
						</td>
						{headers.map((header) => (
							<td key={header.id}></td>
						))}
					</tr>
				</tfoot>
			</table>
			{/* <HeaderMenu
				hide={!clickedHeader.clicked}
				left={clickedHeader.left}
				top={clickedHeader.top}
				name={clickedHeader.name}
				content={					<input
						autoFocus
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<div className="NLT__inner-menu-title">Property Type</div>
					<p className="NLT__inner-menu-item">Text</p>
					<p className="NLT__inner-menu-item">Number</p>
					<p className="NLT__inner-menu-item">Tag</p>
					<p className="NLT__inner-menu-item">Multi-Tag</p>
				onOutsideClick={handleOutsideClick}
			/> */}
		</div>
	);
}
