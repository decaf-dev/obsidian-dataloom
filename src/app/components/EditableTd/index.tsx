import React, { useState, useRef, useEffect, useCallback } from "react";

import Menu from "../Menu";
import TextCell from "../TextCell";
import TagCell from "../TagCell";
// import MultiTagCell from "../MultiTagCell";
import TagMenu from "../TagMenu";

import { useForceUpdate, useApp, randomColor } from "../../services/utils";
import { Tag } from "../../services/state";
import {
	tagLinkForDisplay,
	stripLink,
	toFileLink,
	toTagLink,
} from "../../services/dataUtils";

import { CELL_TYPE } from "../../constants";

import "./styles.css";

interface Props {
	cellId: string;
	width: string;
	content: string;
	tags: Tag[];
	type: string;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onTagClick: (cellId: string, inputText: string) => void;
	onUpdateContent: (cellId: string, inputText: string) => void;
	onAddTag: (cellId: string, inputText: string, color: string) => void;
}

export default function EditableTd({
	cellId,
	width,
	content,
	tags,
	type,
	onRemoveTagClick,
	onTagClick,
	onUpdateContent,
	onAddTag,
}: Props) {
	const [inputText, setInputText] = useState("");

	const tdRef = useRef<HTMLDivElement>();

	const forceUpdate = useForceUpdate();

	const initialClickCell = {
		top: 0,
		left: 0,
		height: 0,
		tagColor: "",
	};
	const [clickedCell, setClickedCell] = useState(initialClickCell);

	const { workspace } = useApp() || {};

	useEffect(() => {
		if (clickedCell.height > 0) forceUpdate();
	}, [clickedCell.height, forceUpdate]);

	const textAreaRef = useCallback(
		(node) => {
			if (type === CELL_TYPE.TEXT || type === CELL_TYPE.NUMBER)
				if (node) {
					node.selectionStart = inputText.length;
					node.selectionEnd = inputText.length;
				}
		},
		[type, inputText.length]
	);

	console.log("INPUT", inputText);

	useEffect(() => {
		switch (type) {
			case CELL_TYPE.TEXT:
			case CELL_TYPE.NUMBER:
				setInputText(stripLink(content));
				break;
			default:
				break;
		}
	}, [type, content]);

	function handleCellClick(e: React.MouseEvent<HTMLElement>) {
		const el = e.target as HTMLInputElement;
		//If we clicked on the link for a file or tag, return
		if (el.nodeName === "A") return;

		//If we've already clicked a cell
		if (clickedCell.height > 0) return;

		if (tdRef.current) {
			let fileExplorerWidth = 0;
			let ribbonWidth = 0;

			//Check if defined, it will be undefined if we're developing using react-scripts
			//and not rendering in Obsidian
			if (workspace) {
				const el = workspace.containerEl;
				const ribbon = el.getElementsByClassName(
					"workspace-ribbon"
				)[0] as HTMLElement;
				const fileExplorer = el.getElementsByClassName(
					"workspace-split"
				)[0] as HTMLElement;

				fileExplorerWidth = fileExplorer.offsetWidth;
				ribbonWidth = ribbon.offsetWidth;
			}

			const { x, y, height } = tdRef.current.getBoundingClientRect();

			setClickedCell({
				left: x - fileExplorerWidth - ribbonWidth,
				top: y - 22,
				height,
				tagColor: randomColor(),
			});
		}
	}

	function handleAddTag(text: string) {
		onAddTag(cellId, toTagLink(text), clickedCell.tagColor);
		setInputText("");
		setClickedCell(initialClickCell);
	}

	function handleTagClick(id: string) {
		onTagClick(cellId, id);
		setClickedCell(initialClickCell);
	}

	function handleOutsideClick() {
		switch (type) {
			case CELL_TYPE.TEXT:
			case CELL_TYPE.NUMBER:
				onUpdateContent(cellId, toFileLink(inputText));
				break;
			case CELL_TYPE.TAG:
				setInputText("");
				break;
			default:
				break;
		}
		setClickedCell(initialClickCell);
	}

	function renderCell() {
		const tag = tags.find((tag) => tag.selected.includes(cellId));
		switch (type) {
			case CELL_TYPE.TEXT:
				return <TextCell content={content} />;
			case CELL_TYPE.NUMBER:
				return <TextCell content={content} />;
			case CELL_TYPE.TAG:
				if (tag) {
					return (
						<TagCell
							content={tagLinkForDisplay(tag.content)}
							color={tag.color}
						/>
					);
				}
				return <></>;
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
					<TagMenu
						cellId={cellId}
						tags={tags}
						color={clickedCell.tagColor}
						inputText={inputText}
						onAddTag={handleAddTag}
						onTextChange={(e) => setInputText(e.target.value)}
						onRemoveTagClick={onRemoveTagClick}
						onTagClick={handleTagClick}
					/>
				);
			// case CELL_TYPE.MULTI_TAG:
			// 	return (
			// 	);
			default:
				return <></>;
		}
	}

	function getMenuWidth() {
		switch (type) {
			case CELL_TYPE.TAG:
				// case CELL_TYPE.MULTI_TAG:
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
				// case CELL_TYPE.MULTI_TAG:
				return "fit-content";
			default:
				return clickedCell.height;
		}
	}

	let tdClassName = "NLT__td";
	if (type === CELL_TYPE.NUMBER) tdClassName += " NLT__td--number";

	return (
		<div
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
		</div>
	);
}
