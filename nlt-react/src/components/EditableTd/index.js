import React, { useState, useRef, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";

import Menu from "../Menu";
import TextCell from "../TextCell";
import TagCell from "../TagCell";
import MultiTagCell from "../MultiTagCell";
import TagMenu from "../TagMenu";

import { useForceUpdate } from "../../services/utils";

import { CELL_TYPE } from "../../constants";

import "./styles.css";

export default function EditableTd({
	width = "",
	content = "",
	type = "",
	onSaveClick = null,
}) {
	const [text, setText] = useState("");
	const [tags, setTags] = useState([]);

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
		if (type === CELL_TYPE.TEXT || type === CELL_TYPE.NUMBER)
			setText(content);
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
			case CELL_TYPE.NUMBER:
				onSaveClick(text);
				break;
			case CELL_TYPE.TAG:
				const selected = tags.find((tag) => tag.selected === true);
				if (selected) onSaveClick(selected.content);
				else onSaveClick("");
				break;
			case CELL_TYPE.MULTI_TAG:
				break;
			default:
				break;
		}
		setClickedCell(initialClickCell);
	}

	function handleRemoveTagClick(id) {
		//TODO if referenced multiple places, then keep
		setTags((prevState) => prevState.filter((tag) => tag.id !== id));
	}

	function handleTagClick() {}

	function handleAddTag(text) {
		//If already exists then return
		const tag = tags.find((tag) => tag.content === text);
		if (tag !== undefined) return;

		//Set all previous to not selected
		//Add this and set to selected
		setTags((prevState) => [
			// ...prevState.map((tag) => {
			// 	return { ...tag, selected: false };
			// }),
			{ id: uuidv4(), content: text, selected: true },
		]);
		setText("");
	}

	function renderContent() {
		switch (type) {
			case CELL_TYPE.TEXT:
				return <TextCell content={content} />;
			case CELL_TYPE.NUMBER:
				return <TextCell content={content} />;
			case CELL_TYPE.TAG:
				return <TagCell content={content} hide={content === ""} />;
			case CELL_TYPE.MULTI_TAG:
				return <MultiTagCell />;
			default:
				return <></>;
		}
	}

	function renderClickContent() {
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
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
				);
			case CELL_TYPE.TAG:
				return (
					<TagMenu
						selectedTag={tags.find((tag) => tag.selected === true)}
						tags={tags}
						text={text}
						onAddTag={handleAddTag}
						onTextChange={(e) => setText(e.target.value)}
						onRemoveTagClick={handleRemoveTagClick}
						onTagClick={handleTagClick}
					/>
				);
			case CELL_TYPE.MULTI_TAG:
				return;
			default:
				return <></>;
		}
	}

	function getMenuWidth() {
		switch (type) {
			case CELL_TYPE.TAG:
				return "fit-content";
			default:
				return tdRef.current ? tdRef.current.offsetWidth : 0;
		}
	}

	function getMenuHeight() {
		switch (type) {
			case CELL_TYPE.NUMBER:
				return "2rem";
			case CELL_TYPE.TAG:
				return "fit-content";
			default:
				return clickedCell.height;
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
			{renderContent()}
			<Menu
				hide={clickedCell.height === 0}
				style={{
					minWidth: type === CELL_TYPE.TEXT ? "11rem" : 0,
					width: getMenuWidth(),
					top: clickedCell.top,
					left: clickedCell.left,
					height: getMenuHeight(),
				}}
				content={renderClickContent()}
				onOutsideClick={handleOutsideClick}
			/>
		</td>
	);
}
