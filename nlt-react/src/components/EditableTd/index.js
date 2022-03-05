import React, { useState, useRef, useEffect } from "react";

import Menu from "../Menu";
import { useForceUpdate } from "../../services/utils";

export default function EditableTd({
	width = "",
	content = "",
	rowId = -1,
	cellId = -1,
	onSaveClick = null,
}) {
	const [textArea, setTextArea] = useState("");
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
		setTextArea(content);
	}, [content]);

	function handleCellClick(e) {
		if (clickedCell.height > 0) return;

		const { x, y, height } = tdRef.current.getBoundingClientRect();
		setClickedCell({ top: y, left: x, height });
		forceUpdate();
	}

	function handleOutsideClick() {
		setClickedCell(initialClickCell);
		onSaveClick({ rowId, cellId, value: textArea });
	}

	return (
		<td
			className="NLT__td"
			ref={tdRef}
			style={{ maxWidth: width }}
			onClick={handleCellClick}
		>
			<p className="NLT__p">{content}</p>
			<Menu
				hide={clickedCell.height === 0}
				style={{
					minWidth: "11rem",
					width: tdRef.current ? tdRef.current.offsetWidth : 0,
					top: clickedCell.top,
					left: clickedCell.left,
					height: clickedCell.height,
				}}
				content={
					<textarea
						className="NLT__textarea"
						ref={textAreaRef}
						autoFocus
						value={textArea}
						onChange={(e) =>
							setTextArea(e.target.value.replace("\n", ""))
						}
					/>
				}
				onOutsideClick={handleOutsideClick}
			/>
		</td>
	);
}
