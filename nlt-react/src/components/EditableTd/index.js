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
	id = "",
	width = "",
	oldText = "",
	oldTags = [],
	type = "",
	findCellTags = null,
	onSaveClick = null,
}) {
	const initialTag = (text) => {
		return { id: uuidv4(), cellId: id, content: text, selected: true };
	};

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
	}, [clickedCell.height, forceUpdate]);

	//Add textAreaRef.current as a dependency with callback
	useEffect(() => {
		if (type === CELL_TYPE.TEXT || type === CELL_TYPE.NUMBER)
			if (textAreaRef.current) {
				textAreaRef.current.selectionStart = text.length;
				textAreaRef.current.selectionEnd = text.length;
			}
	}, [type, text]);

	useEffect(() => {
		switch (type) {
			case CELL_TYPE.TEXT:
			case CELL_TYPE.NUMBER:
				setText(oldText);
				break;
			case CELL_TYPE.TAG:
			case CELL_TYPE.MULTI_TAG:
				console.log("OLD TAGS", oldTags);
				setTags(oldTags);
				break;
			default:
				break;
		}
	}, [type, oldText, oldTags]);

	function handleCellClick(e) {
		if (clickedCell.height > 0) return;

		const { x, y, height } = tdRef.current.getBoundingClientRect();
		setClickedCell({ top: y, left: x, height });

		if (type === CELL_TYPE.TAG || type === CELL_TYPE.MULTI_TAG) {
			//These are all the tags that don't belong to this cell
			const arr = findCellTags(id);
			console.log("CELL TAGS", arr);
			//Combine our current tags with the other cell tags found from other arrays
			setTags((prevState) => [
				...prevState.filter((tag) => {
					//Remove if one of our cell's tags that no longer exists
					if (tag.cellId === id) {
						if (!tag.selected) return false;
						return true;
					} else {
						//Remove if tag from other cell that no longer exists
						const found = arr.find(
							(t) => t.content === tag.content
						);
						if (found) return true;
						return false;
					}
				}),
				//Add new tags
				...arr.filter((tag) => {
					const found = tags.find((t) => t.content === tag.content);
					if (found) return false;
					return true;
				}),
			]);
		}
	}

	console.log("RENDERED TAGS", tags);

	function handleOutsideClick() {
		switch (type) {
			case CELL_TYPE.TEXT:
			case CELL_TYPE.NUMBER:
				onSaveClick(text, []);
				break;
			case CELL_TYPE.TAG:
				if (text !== "") {
					//Check if current text exists as a tag, otherwise add it,
					const found = tags.find((tag) => tag.content === text);
					if (!found) {
						//Remove old ids
						const arr = tags.filter((tag) => tag.cellId !== id);
						onSaveClick("", [initialTag(text), ...arr]);
						setText("");
						break;
					}
				}
				onSaveClick("", tags);
				break;
			case CELL_TYPE.MULTI_TAG:
				// if (text !== "") {
				// 	//Check if current text exists as a tag, otherwise add it,
				// 	const found = tags.find((tag) => tag.content === text);
				// 	if (!found) {
				// 		onSaveClick("", [initialTag(text), ...tags]);
				// 		setText("");
				// 		break;
				// 	}
				// }
				// onSaveClick("", tags);
				break;
			default:
				break;
		}
		setClickedCell(initialClickCell);
	}

	function handleRemoveTagClick(tagId) {
		// //TODO if referenced multiple places, then keep
		// setTags((prevState) => {
		// 	const tag = prevState.find((tag) => tag.id === tagId);
		// 	if (tag.cellId === id) {
		// 		return prevState.filter((tag) => tag.id === tagId);
		// 	} else {
		// 		//Set selected to false
		// 		return prevState.map((tag) => {
		// 			return {
		// 				...tag,
		// 				selected: false,
		// 			};
		// 		});
		// 	}
		// });
	}

	function handleAddTag(text) {
		//If already exists then return
		if (tags.find((tag) => tag.content === text)) return;
		//Filter and remove tag if it doesn't come from this cell
		setTags((prevState) => [
			initialTag(text),
			...prevState
				.filter((tag) => tag.cellId !== id)
				.map((tag) => {
					return { ...tag, selected: false };
				}),
		]);
		setText("");
		setClickedCell(initialClickCell);
	}

	function handleTagClick(tagId) {
		setTags((prevState) =>
			prevState.map((tag) => {
				if (tag.id === tagId) return { ...tag, selected: true };
				return { ...tag, selected: false };
			})
		);
		setClickedCell(initialClickCell);
	}

	function handleMultiTagClick(id) {}

	function handleAddMultiTag(text) {
		// //If already exists then return
		// const tag = tags.find((tag) => tag.content === text);
		// if (tag !== undefined) return;
		// setTags((prevState) => [initialTag(text), ...prevState]);
		// setText("");
	}

	function renderCell() {
		switch (type) {
			case CELL_TYPE.TEXT:
				return <TextCell content={text} />;
			case CELL_TYPE.NUMBER:
				return <TextCell content={text} />;
			case CELL_TYPE.TAG:
				const tag = tags.find((tag) => tag.selected === true);
				return (
					<TagCell
						content={tag !== undefined ? tag.content : ""}
						hide={tag === undefined}
					/>
				);
			case CELL_TYPE.MULTI_TAG:
				return <MultiTagCell tags={tags} />;
			default:
				return <></>;
		}
	}

	function renderCellMenu() {
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
						tags={tags}
						text={text}
						onAddTag={handleAddTag}
						onTextChange={(e) => setText(e.target.value)}
						onRemoveTagClick={handleRemoveTagClick}
						onTagClick={handleTagClick}
					/>
				);
			case CELL_TYPE.MULTI_TAG:
				return (
					<TagMenu
						tags={tags}
						text={text}
						onAddTag={handleAddMultiTag}
						onTextChange={(e) => setText(e.target.value)}
						onRemoveTagClick={handleRemoveTagClick}
						onTagClick={handleMultiTagClick}
					/>
				);
			default:
				return <></>;
		}
	}

	function getMenuWidth() {
		switch (type) {
			case CELL_TYPE.TAG:
			case CELL_TYPE.MULTI_TAG:
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
			case CELL_TYPE.MULTI_TAG:
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
			{renderCell()}
			<Menu
				hide={clickedCell.height === 0}
				style={{
					minWidth: type === CELL_TYPE.TEXT ? "11rem" : 0,
					width: getMenuWidth(),
					top: clickedCell.top,
					left: clickedCell.left,
					height: getMenuHeight(),
				}}
				content={renderCellMenu()}
				onOutsideClick={handleOutsideClick}
			/>
		</td>
	);
}
