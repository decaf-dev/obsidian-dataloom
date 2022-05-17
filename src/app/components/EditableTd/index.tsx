import React, { useState, useEffect, useCallback, useRef } from "react";

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

import { CELL_TYPE, DEBUG, MENU_LEVEL } from "../../constants";

interface Props {
	cell: Cell;
	width: string;
	// isFocused: boolean;
	tags: Tag[];
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onTagClick: (cellId: string, tagId: string) => void;
	onContentChange: (cellId: string, ...rest: any) => void;
	onAddTag: (
		cellId: string,
		headerId: string,
		inputText: string,
		color: string
	) => void;
	// onFocusClick: (cellId: string) => void;
	onColorChange: (tagId: string, color: string) => void;
}

export default function EditableTd({
	cell,
	width,
	tags,
	onRemoveTagClick,
	onColorChange,
	onTagClick,
	onContentChange,
	onAddTag,
}: Props) {
	const [inputText, setInputText] = useState("");
	const [cellMenu, setCellMenu] = useState({
		top: -4,
		left: -11,
		width: "0px",
		height: "0px",
		tagColor: randomColor(),
	});
	const { isMenuOpen, openMenu } = useMenu();

	const [menuId] = useState(uuidv4());

	const content = cell.toString();
	const { id, headerId, type, expectedType } = cell;
	const didMount = useRef(false);

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
		[inputText.length, isMenuOpen(menuId)]
	);

	async function handleCellContextClick(e: React.MouseEvent<HTMLElement>) {
		if (DEBUG.EDITABLE_TD.HANDLER)
			console.log("[EditableTd] handleCellContextClick()");
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
		if (DEBUG.EDITABLE_TD.HANDLER)
			console.log("[EditableTd] handleCellClick()");
		const el = e.target as HTMLInputElement;

		//If we clicked on the link for a file or tag, return
		if (el.nodeName === "A") return;
		if (type === CELL_TYPE.ERROR) return;

		// onFocusClick(id);
		openMenu(menuId, MENU_LEVEL.ONE);
	}

	function handleAddTag(text: string) {
		if (DEBUG.EDITABLE_TD.HANDLER)
			console.log(`[EditableTd] handleAddTag("${text}")`);
		onAddTag(id, headerId, text, cellMenu.tagColor);
		setInputText("");
	}

	function handleTagClick(tagId: string) {
		if (DEBUG.EDITABLE_TD.HANDLER)
			console.log(`[EditableTd] handleTagClick("${tagId}")`);
		onTagClick(id, tagId);
	}

	function updateContent(updated: string) {
		if (content !== updated) {
			switch (type) {
				case CELL_TYPE.TEXT:
					onContentChange(id, inputText);
					break;
				case CELL_TYPE.NUMBER:
					onContentChange(id, parseInt(inputText));
					break;
				case CELL_TYPE.DATE:
					onContentChange(id, parseInputDate(inputText));
					break;
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

	function handleCheckboxChange(isChecked: boolean) {
		if (DEBUG.EDITABLE_TD.HANDLER)
			console.log(`[EditableTd] handleCheckboxChange("${isChecked}")`);
		onContentChange(id, isChecked);
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
		if (DEBUG.EDITABLE_TD.HANDLER)
			console.log(`[EditableTd] handleInputChange("${value}")`);
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
		if (!didMount.current) {
			didMount.current = true;
		} else {
			if (!isMenuOpen(menuId)) {
				if (DEBUG.EDITABLE_TD.USE_EFFECT)
					console.log(
						`[EditableTd] useEffect(updateContent("${inputText}"))`
					);
				updateContent(inputText);
			}
		}
	}, [didMount.current, isMenuOpen(menuId)]);

	useEffect(() => {
		if (DEBUG.EDITABLE_TD.USE_EFFECT)
			console.log(`[EditableTd] useEffect(setInputText("${content}"))`);
		if (type === CELL_TYPE.DATE) {
			//Support data cells that have blank
			if (content != "") {
				setInputText(parseDateForInput(content));
			} else {
				setInputText("");
			}
		} else {
			setInputText(content);
		}
	}, []);

	useEffect(() => {
		didMount.current = true;
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
