import React, { useState, useRef, useEffect } from "react";

import Menu from "../Menu";
import { useForceUpdate } from "../../services/utils";
import { CELL_TYPE } from "../../constants";

export default function EditableTd({
	width = "",
	content = "",
	type = "",
	onSaveClick = null,
}) {
	const [text, setText] = useState("");
	const [number, setNumber] = useState("");
	// const [tag, setTag] = useState("");
	// const [multiTag, setMultiTag] = useState([]);

	const tdRef = useRef();
	const textAreaRef = useRef();

	const forceUpdate = useForceUpdate();

	const initialClickCell = {
		top: 0,
		left: 0,
		height: 0,
	};
	const [clickedCell, setClickedCell] = useState(initialClickCell);

	useEffect(() => {
		if (clickedCell.height > 0) forceUpdate();
	}, [clickedCell.height]);

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.selectionStart = content.length;
			textAreaRef.current.selectionEnd = content.length;
		}
	}, [textAreaRef.current]);

	useEffect(() => {
		switch (type) {
			case CELL_TYPE.TEXT:
				setText(content);
				break;
			case CELL_TYPE.NUMBER:
				setNumber(content);
				break;
			case CELL_TYPE.TAG:
				break;
			case CELL_TYPE.MULTI_TAG:
				break;
			default:
				break;
		}
	}, [content]);

	function handleCellClick(e) {
		if (clickedCell.height > 0) return;

		const { x, y, height } = tdRef.current.getBoundingClientRect();
		setClickedCell({ top: y, left: x, height });
		forceUpdate();
	}

	function handleOutsideClick() {
		switch (type) {
			case CELL_TYPE.TEXT:
				onSaveClick(text);
				break;
			case CELL_TYPE.NUMBER:
				onSaveClick(number);
				break;
			case CELL_TYPE.TAG:
				break;
			case CELL_TYPE.MULTI_TAG:
				break;
			default:
				break;
		}
		setClickedCell(initialClickCell);
	}
	console.log(type);

	function renderContent() {
		switch (type) {
			case CELL_TYPE.TEXT:
				return (
					<textarea
						className="NLT__input"
						ref={textAreaRef}
						autoFocus
						value={text}
						onChange={(e) =>
							setText(e.target.value.replace("\n", ""))
						}
					/>
				);
			case CELL_TYPE.NUMBER:
				return (
					<input
						className="NLT__input NLT__input--number"
						type="number"
						autoFocus
						value={number}
						onChange={(e) => setNumber(e.target.value)}
					/>
				);
			case CELL_TYPE.TAG:
				return;
			case CELL_TYPE.MULTI_TAG:
				return;
			default:
				return <></>;
		}
	}

	let tdClassName = "NLT__td";
	if (type === CELL_TYPE.NUMBER) tdClassName += " NLT__td--number";

	return (
		<td
			className={tdClassName}
			ref={tdRef}
			style={{ maxWidth: width }}
			onClick={handleCellClick}
		>
			<p className="NLT__p">{content}</p>
			<Menu
				hide={clickedCell.height === 0}
				style={{
					minWidth: type === CELL_TYPE.TEXT ? "11rem" : 0,
					width: tdRef.current ? tdRef.current.offsetWidth : 0,
					top: clickedCell.top,
					left: clickedCell.left,
					height:
						type === CELL_TYPE.NUMBER ? "2rem" : clickedCell.height,
				}}
				content={renderContent()}
				onOutsideClick={handleOutsideClick}
			/>
		</td>
	);
}
