import React, { useState, useRef, useEffect, useCallback } from "react";

import Menu from "../Menu";
import TextCell from "../TextCell";
import TagCell from "../TagCell";
import ErrorCell from "../ErrorCell";
import TagMenuContent from "../TagMenuContent";

import { useForceUpdate } from "../../services/hooks";
import { randomColor, addPound } from "../../services/utils";
import { Tag } from "../../services/state";

import { CELL_TYPE } from "../../constants";

import "./styles.css";

interface Props {
	cellId: string;
	headerId: string;
	width: string;
	content: string;
	tags: Tag[];
	type: string;
	expectedType: string | null;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onTagClick: (cellId: string, inputText: string) => void;
	onUpdateContent: (cellId: string, inputText: string) => void;
	onAddTag: (
		cellId: string,
		headerId: string,
		inputText: string,
		color: string
	) => void;
}

export default function EditableTd({
	cellId,
	headerId,
	width,
	content,
	tags,
	type,
	expectedType,
	onRemoveTagClick,
	onTagClick,
	onUpdateContent,
	onAddTag,
}: Props) {
	const [inputText, setInputText] = useState("");

	const tdRef = useRef<HTMLTableCellElement>();
	const forceUpdate = useForceUpdate();

	const initialCellMenuState = {
		isOpen: false,
		top: 0,
		left: 0,
		height: 0,
		tagColor: "",
	};
	const [cellMenu, setCellMenu] = useState(initialCellMenuState);
	const firstRender = useRef(false);

	useEffect(() => {
		if (cellMenu.isOpen) forceUpdate();
	}, [cellMenu.isOpen, forceUpdate]);

	const textAreaRef = useCallback(
		(node) => {
			if (type === CELL_TYPE.TEXT || type === CELL_TYPE.NUMBER)
				if (node) {
					if (!firstRender.current) {
						node.selectionStart = inputText.length;
						node.selectionEnd = inputText.length;
						firstRender.current = true;
					}
				}
		},
		[type, inputText.length]
	);

	async function handleCellContextClick(e: React.MouseEvent<HTMLElement>) {
		try {
			let text = content;
			if (type === CELL_TYPE.TAG) {
				const tag = tags.find((tag) => tag.selected.includes(cellId));
				text = addPound(tag.content);
			}
			navigator.clipboard.writeText(text);
		} catch (err) {
			console.log(err);
		}
	}

	function handleCellClick(e: React.MouseEvent<HTMLElement>) {
		const el = e.target as HTMLInputElement;

		//If we clicked on the link for a file or tag, return
		if (el.nodeName === "A") return;
		if (type === CELL_TYPE.ERROR) return;

		if (tdRef.current) {
			const { height } = tdRef.current.getBoundingClientRect();
			setCellMenu({
				isOpen: true,
				left: -10,
				top: -5,
				height,
				tagColor: randomColor(),
			});
			setInputText(content);
		}
	}

	function handleAddTag(text: string) {
		onAddTag(cellId, headerId, text, cellMenu.tagColor);
		setInputText("");
		setCellMenu(initialCellMenuState);
	}

	function handleTagClick(id: string) {
		onTagClick(cellId, id);
		setCellMenu(initialCellMenuState);
	}

	function handleOutsideClick() {
		//If we're in Live Preview mode and we click on the header and then click on the outside of
		//the component, the header will close, set the data (which didn't change), which cause an update
		//which persists the data again. We can prevent this by only calling onOutsideClick
		//if the data has actually changed
		if (inputText !== content) {
			switch (type) {
				case CELL_TYPE.TEXT:
					onUpdateContent(cellId, inputText);
					setInputText("");
					break;
				case CELL_TYPE.NUMBER:
					onUpdateContent(cellId, inputText);
					setInputText("");
					break;
				case CELL_TYPE.TAG:
					setInputText("");
					break;
				default:
					break;
			}
		}
		setCellMenu(initialCellMenuState);
	}

	function renderCell() {
		switch (type) {
			case CELL_TYPE.TEXT:
				return <TextCell content={content} />;
			case CELL_TYPE.NUMBER:
				return <TextCell content={content} />;
			case CELL_TYPE.TAG: {
				const tag = tags.find((tag) => tag.selected.includes(cellId));
				if (tag)
					return (
						<TagCell
							content={tag.content}
							color={tag.color}
							showLink={true}
						/>
					);
				return <></>;
			}
			case CELL_TYPE.ERROR:
				return <ErrorCell type={expectedType} />;
			default:
				return <></>;
		}
	}

	function renderCellMenuContent() {
		switch (type) {
			case CELL_TYPE.TEXT:
				return (
					<textarea
						className="NLT__input"
						ref={textAreaRef}
						autoFocus
						value={inputText}
						onChange={(e) =>
							setInputText(e.target.value.replace("\n", ""))
						}
					/>
				);
			case CELL_TYPE.NUMBER:
				return (
					<input
						className="NLT__input NLT__input--number"
						type="number"
						autoFocus
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
					/>
				);
			case CELL_TYPE.TAG:
				return (
					<TagMenuContent
						cellId={cellId}
						tags={tags}
						color={cellMenu.tagColor}
						inputText={inputText}
						onAddTag={handleAddTag}
						onTextChange={(e) => setInputText(e.target.value)}
						onRemoveTagClick={onRemoveTagClick}
						onTagClick={handleTagClick}
					/>
				);
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
				return cellMenu.height;
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
			onContextMenu={handleCellContextClick}
		>
			<Menu
				isOpen={cellMenu.isOpen}
				style={{
					minWidth: type === CELL_TYPE.TEXT ? "11rem" : 0,
					width: getMenuWidth(),
					top: `${cellMenu.top}px`,
					left: `${cellMenu.left}px`,
					height: getMenuHeight(),
				}}
				content={renderCellMenuContent()}
				onOutsideClick={handleOutsideClick}
			/>
			<>
				{renderCell()}
				<textarea readOnly className="NLT__hidden-textarea" />
			</>
		</td>
	);
}
