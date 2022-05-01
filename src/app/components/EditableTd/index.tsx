import React, { useState, useRef, useEffect, useCallback } from "react";
import { Notice } from "obsidian";

import CellEditMenu from "../CellEditMenu";
import TextCell from "../TextCell";
import TagCell from "../TagCell";
import ErrorCell from "../ErrorCell";

import { randomColor, addPound } from "../../services/utils";
import { Tag } from "../../services/state";

import { CELL_TYPE } from "../../constants";

import "./styles.css";

interface Props {
	cellId: string;
	headerId: string;
	width: string;
	content: string;
	isFocused: boolean;
	tags: Tag[];
	type: string;
	expectedType: string | null;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onTagClick: (cellId: string, inputText: string) => void;
	onContentChange: (
		cellId: string,
		inputText: string,
		shouldUpdate: boolean
	) => void;
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
	isFocused,
	tags,
	type,
	expectedType,
	onRemoveTagClick,
	onTagClick,
	onContentChange,
	onAddTag,
}: Props) {
	const [inputText, setInputText] = useState("");

	const initialCellMenuState = {
		isOpen: false,
		top: 0,
		left: 0,
		width: 0,
		height: 0,
		tagColor: "",
	};
	const [cellMenu, setCellMenu] = useState(initialCellMenuState);

	useEffect(() => {
		if (isFocused) {
			openMenu();
		}
	}, [isFocused]);

	const tdRef = useCallback(
		(node) => {
			if (node) {
				if (node instanceof HTMLElement) {
					setTimeout(() => {
						setCellMenu((prevState) => {
							const { width, height } =
								node.getBoundingClientRect();
							return {
								...prevState,
								width,
								height,
							};
						});
					}, 1);
				}
			}
		},
		[content.length, cellMenu.isOpen]
	);

	function handleTabPress() {
		updateContent(false);
	}

	async function handleCellContextClick(e: React.MouseEvent<HTMLElement>) {
		try {
			let text = content;
			if (type === CELL_TYPE.TAG) {
				const tag = tags.find((tag) => tag.selected.includes(cellId));
				text = addPound(tag.content);
			}
			await navigator.clipboard.writeText(text);
			new Notice("Cell text copied");
		} catch (err) {
			console.log(err);
		}
	}

	function handleKeyUp(e: React.KeyboardEvent) {
		if (type === CELL_TYPE.ERROR) return;
		if (e.key === "Enter") openMenu();
	}

	function handleCellClick(e: React.MouseEvent<HTMLElement>) {
		const el = e.target as HTMLInputElement;

		//If we clicked on the link for a file or tag, return
		if (el.nodeName === "A") return;
		if (type === CELL_TYPE.ERROR) return;

		openMenu();
	}

	function closeMenu() {
		setCellMenu(initialCellMenuState);
	}

	function openMenu() {
		setCellMenu((prevState) => {
			return {
				...prevState,
				isOpen: true,
				left: -10,
				top: -5,
				tagColor: randomColor(),
			};
		});
		setInputText(content);
	}

	function handleAddTag(text: string) {
		onAddTag(cellId, headerId, text, cellMenu.tagColor);
		setInputText("");
		closeMenu();
	}

	function handleTagClick(id: string) {
		onTagClick(cellId, id);
		closeMenu();
	}

	function updateContent(shouldUpdate: boolean) {
		switch (type) {
			case CELL_TYPE.TEXT:
				onContentChange(cellId, inputText, shouldUpdate);
				setInputText("");
				break;
			case CELL_TYPE.NUMBER:
				onContentChange(cellId, inputText, shouldUpdate);
				setInputText("");
				break;
			case CELL_TYPE.TAG:
				setInputText("");
				break;
			default:
				break;
		}
		closeMenu();
	}

	function handleOutsideClick() {
		updateContent(true);
	}

	function renderCell() {
		switch (type) {
			case CELL_TYPE.TEXT:
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

	let tdClassName = "NLT__td";
	if (type === CELL_TYPE.NUMBER) tdClassName += " NLT__td--number";

	return (
		<td
			className={tdClassName}
			ref={tdRef}
			onClick={handleCellClick}
			onKeyUp={handleKeyUp}
			onContextMenu={handleCellContextClick}
		>
			<CellEditMenu
				style={{
					minHeight: "3rem",
					height: `${cellMenu.height}px`,
					width: `${cellMenu.width}px`,
					top: `${cellMenu.top}px`,
					left: `${cellMenu.left}px`,
				}}
				isOpen={cellMenu.isOpen}
				cellType={type}
				tags={tags}
				cellId={cellId}
				tagColor={cellMenu.tagColor}
				inputText={inputText}
				onInputChange={setInputText}
				onOutsideClick={handleOutsideClick}
				onTabPress={handleTabPress}
				onAddTag={handleAddTag}
				onRemoveTagClick={onRemoveTagClick}
				onTagClick={handleTagClick}
			/>
			<div className="NLT__td-content-container" style={{ width }}>
				{renderCell()}
			</div>
		</td>
	);
}
