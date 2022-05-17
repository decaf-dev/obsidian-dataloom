import React, { useState, useEffect, useCallback } from "react";

import { Notice } from "obsidian";
import { v4 as uuidv4 } from "uuid";

import TextCell from "../TextCell";
import TagCell from "../TagCell";
import ErrorCell from "../ErrorCell";
import CheckboxCell from "../CheckboxCell";
import DateCell from "../DateCell";
import NumberCell from "../NumberCell";
import DateCellEdit from "../DateCellEdit";
import NumberCellEdit from "../NumberCellEdit";
import TextCellEdit from "../TextCellEdit";
import TagCellEdit from "../TagCellEdit";

import { useMenu } from "../MenuProvider";
import { randomColor } from "src/app/services/random";
import { addPound } from "src/app/services/string/adders";
import { Tag } from "src/app/services/appData/state/tag";
import { Cell } from "src/app/services/appData/state/cell";
import {
	parseDateForInput,
	parseInputDate,
} from "src/app/services/string/parsers";

import "./styles.css";

import { CELL_TYPE, MENU_LEVEL } from "../../constants";

interface Props {
	cell: Cell;
	width: string;
	isFocused: boolean;
	tags: Tag[];
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onTagClick: (cellId: string, tagId: string) => void;
	onContentChange: (
		cellId: string,
		shouldLock: boolean,
		...rest: any
	) => void;
	onAddTag: (
		cellId: string,
		headerId: string,
		inputText: string,
		color: string
	) => void;
	onFocusClick: (cellId: string) => void;
	onOutsideClick: () => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function EditableTd({
	cell,
	width,
	isFocused,
	tags,
	onOutsideClick,
	onRemoveTagClick,
	onColorChange,
	onTagClick,
	onFocusClick,
	onContentChange,
	onAddTag,
}: Props) {
	const [inputText, setInputText] = useState("");
	const [cellMenu, setCellMenu] = useState({
		top: -3,
		left: -10,
		width: "0px",
		height: "0px",
		tagColor: randomColor(),
	});
	const { isMenuOpen, openMenu } = useMenu();

	const [menuId] = useState(uuidv4());

	const content = cell.toString();
	const { id, headerId, type, expectedType } = cell;

	const tdRef = useCallback(
		(node) => {
			if (node) {
				if (node instanceof HTMLElement) {
					//Set timeout to overcome bug where all values in the node are 0
					//See: https://github.com/facebook/react/issues/13108
					setTimeout(() => {
						setCellMenu((prevState) => {
							const { width, height } =
								node.getBoundingClientRect();
							function findWidth() {
								switch (type) {
									case CELL_TYPE.DATE:
									case CELL_TYPE.TAG:
										return "fit-content";
									default:
										return `${width}px`;
								}
							}
							function findHeight() {
								switch (type) {
									case CELL_TYPE.TEXT:
									case CELL_TYPE.TAG:
										return "fit-content";
									case CELL_TYPE.NUMBER:
										return "3rem";
									default:
										return `${height}px`;
								}
							}
							return {
								...prevState,
								width: findWidth(),
								height: findHeight(),
							};
						});
					}, 1);
				}
			}
		},
		[inputText, isMenuOpen(menuId)]
	);

	// function handleTabPress() {
	// 	updateContent(true);
	// }

	async function handleCellContextClick(e: React.MouseEvent<HTMLElement>) {
		try {
			let text = content;
			if (type === CELL_TYPE.TAG) {
				const tag = tags.find((tag) => tag.selected.includes(id));
				text = addPound(tag.content);
			}
			await navigator.clipboard.writeText(text);
			new Notice("Cell text copied");
		} catch (err) {
			console.log(err);
		}
	}

	function handleCellClick(e: React.MouseEvent<HTMLElement>) {
		const el = e.target as HTMLInputElement;

		//If we clicked on the link for a file or tag, return
		if (el.nodeName === "A") return;
		if (type === CELL_TYPE.ERROR) return;

		// onFocusClick(id);
		openMenu(menuId, MENU_LEVEL.ONE);
	}

	// 	left: -10,
	// top: -5,

	function handleAddTag(text: string) {
		onAddTag(id, headerId, text, cellMenu.tagColor);
		setInputText("");
		onOutsideClick();
	}

	function handleTagClick(tagId: string) {
		onTagClick(id, tagId);
		onOutsideClick();
	}

	function updateContent(shouldLock: boolean) {
		if (content !== inputText) {
			switch (type) {
				case CELL_TYPE.TEXT:
					onContentChange(id, shouldLock, inputText);
					setInputText("");
					break;
				case CELL_TYPE.NUMBER:
					onContentChange(id, shouldLock, parseInt(inputText));
					setInputText("");
					break;
				case CELL_TYPE.DATE:
					onContentChange(id, shouldLock, parseInputDate(inputText));
					setInputText("");
					break;
				//TODO add lock
				case CELL_TYPE.TAG: {
					const tag = tags.find((tag) => tag.content === inputText);
					if (tag) {
						onTagClick(id, tag.id);
					} else {
						onAddTag(id, headerId, inputText, cellMenu.tagColor);
					}
					setInputText("");
					break;
				}
				default:
					break;
			}
		}
	}

	// function handleOutsideClick() {
	// 	onOutsideClick();
	// }

	// //Synchronous handler
	// //Runs after handle outside click
	// useEffect(() => {
	// 	if (closingMenu.current && !isFocused) {
	// 		//Set updated false
	// 		//handle update
	// 		closingMenu.current = false;
	// 		updateContent(false);
	// 	}
	// }, [isFocused, closingMenu.current]);

	function handleCheckboxChange(isChecked: boolean) {
		onContentChange(id, false, isChecked);
	}

	function renderCell(): React.ReactNode {
		switch (type) {
			case CELL_TYPE.TEXT:
				return <TextCell text={content} />;
			case CELL_TYPE.NUMBER:
				return <NumberCell number={content} />;
			case CELL_TYPE.TAG: {
				const tag = tags.find((tag) => tag.selected.includes(id));
				if (tag)
					return (
						<TagCell
							style={{ overflow: "hidden" }}
							content={tag.content}
							color={tag.color}
							showLink={true}
						/>
					);
				return <></>;
			}
			case CELL_TYPE.DATE:
				return <DateCell date={content} />;
			case CELL_TYPE.CHECKBOX:
				return (
					<CheckboxCell
						isChecked={content.includes("x")}
						onCheckboxChange={handleCheckboxChange}
					/>
				);
			case CELL_TYPE.ERROR:
				return <ErrorCell type={expectedType} />;
			default:
				return <></>;
		}
	}

	function handleInputChange(value: string) {
		setInputText(value);
	}

	function renderCellMenu() {
		switch (type) {
			case CELL_TYPE.TEXT:
				return (
					<TextCellEdit
						menuId={menuId}
						isOpen={isMenuOpen(menuId)}
						top={cellMenu.top}
						left={cellMenu.left}
						width={cellMenu.width}
						height={cellMenu.height}
						inputText={inputText}
						onInputChange={handleInputChange}
					/>
				);
			case CELL_TYPE.NUMBER:
				return (
					<NumberCellEdit
						menuId={menuId}
						isOpen={isMenuOpen(menuId)}
						top={cellMenu.top}
						left={cellMenu.left}
						width={cellMenu.width}
						height={cellMenu.height}
						inputText={inputText}
						onInputChange={handleInputChange}
					/>
				);
			case CELL_TYPE.TAG:
				return (
					<TagCellEdit
						cellId={id}
						tags={tags}
						menuId={menuId}
						isOpen={isMenuOpen(menuId)}
						top={cellMenu.top}
						left={cellMenu.left}
						width={cellMenu.width}
						height={cellMenu.height}
						inputText={inputText}
						color={cellMenu.tagColor}
						onInputChange={handleInputChange}
						onColorChange={onColorChange}
						onAddTag={handleAddTag}
						onRemoveTagClick={onRemoveTagClick}
						onTagClick={handleTagClick}
					/>
				);
			case CELL_TYPE.DATE:
				return (
					<DateCellEdit
						menuId={menuId}
						isOpen={isMenuOpen(menuId)}
						top={cellMenu.top}
						left={cellMenu.left}
						width={cellMenu.width}
						height={cellMenu.height}
						inputText={inputText}
						onInputChange={handleInputChange}
					/>
				);
			default:
				return <></>;
		}
	}

	useEffect(() => {
		if (!isMenuOpen(menuId)) {
			if (inputText.length !== 0) updateContent(false);
		}
	}, [isMenuOpen(menuId)]);

	useEffect(() => {
		if (type === CELL_TYPE.DATE) {
			setInputText(parseDateForInput(content));
		} else {
			setInputText(content);
		}
	}, []);

	return (
		<td
			className="NLT__td"
			ref={tdRef}
			onClick={handleCellClick}
			onContextMenu={handleCellContextClick}
		>
			{renderCellMenu()}
			<div className="NLT__td-content-container" style={{ width }}>
				{renderCell()}
			</div>
		</td>
	);
}
