import React, { useState, useEffect, useCallback, useRef } from "react";

import { Notice } from "obsidian";
import { v4 as uuidv4 } from "uuid";

import TextCell from "../TextCell";
import TagCell from "../TagCell";
import ErrorCell from "../ErrorCell";
import CheckboxCell from "../CheckboxCell";
import DateCell from "../DateCell";
import NumberCell from "../NumberCell";
import NumberCellEdit from "../NumberCellEdit";
import TextCellEdit from "../TextCellEdit";
import TagCellEdit from "../TagCellEdit";
import DateCellEdit from "../DateCellEdit";

import { useMenu } from "../MenuProvider";
import { randomColor } from "src/app/services/random";
import { Tag } from "src/app/services/appData/state/tag";
import { Cell } from "src/app/services/appData/state/cell";
import { parseDateForInput } from "src/app/services/string/parsers";

import "./styles.css";

import { CELL_TYPE, DEBUG, MENU_LEVEL } from "../../constants";
import { useResizeTime } from "src/app/services/hooks";

interface Props {
	cell: Cell;
	width: string;
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
		top: 0,
		left: 0,
		width: "0px",
		height: "0px",
		tagColor: randomColor(),
	});

	const [menuId] = useState(uuidv4());

	const content = cell.toString();
	const { id, headerId, type, expectedType } = cell;
	const didMount = useRef(false);
	const { isOpen, open } = useMenu(menuId, MENU_LEVEL.ONE);
	const resizeTime = useResizeTime();

	const tdRef = useCallback(
		(node) => {
			if (node) {
				if (node instanceof HTMLElement) {
					//Set timeout to overcome bug where all values in the node are 0
					//See: https://github.com/facebook/react/issues/13108
					setCellMenu((prevState) => {
						const { top, left, width, height } =
							node.getBoundingClientRect();
						return {
							...prevState,
							top,
							left,
							width: `${width}px`,
							height: `${height}px`,
						};
					});
				}
			}
		},
		[inputText.length, isOpen, resizeTime]
	);

	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
		} else {
			if (!isOpen) {
				if (DEBUG.EDITABLE_TD.USE_EFFECT)
					console.log(
						`[EditableTd] useEffect(updateContent("${inputText}"))`
					);
				updateContent(inputText);
			}
		}
	}, [didMount.current, isOpen]);

	useEffect(() => {
		if (DEBUG.EDITABLE_TD.USE_EFFECT)
			console.log(`[EditableTd] useEffect(setInputText("${content}"))`);
		setInputText(content);
	}, []);

	useEffect(() => {
		didMount.current = true;
	}, []);

	async function handleCellContextClick(e: React.MouseEvent<HTMLElement>) {
		if (DEBUG.EDITABLE_TD.HANDLER)
			console.log("[EditableTd] handleCellContextClick()");
		try {
			await navigator.clipboard.writeText(content);
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

		open();
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
				case CELL_TYPE.DATE:
					onContentChange(
						id,
						inputText !== "" ? new Date(inputText) : null
					);
					break;
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
				return <DateCell text={content} />;
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

	function handleDateChange(date: Date) {
		if (DEBUG.EDITABLE_TD.HANDLER) {
			console.log(`[EditableTd] handledDateChange`);
		}
		if (date) {
			setInputText(parseDateForInput(date));
		} else {
			setInputText("");
		}
	}

	function renderCellMenu() {
		switch (type) {
			case CELL_TYPE.TEXT:
				return (
					<TextCellEdit
						menuId={menuId}
						isOpen={isOpen}
						top={cellMenu.top}
						left={cellMenu.left}
						width={cellMenu.width}
						inputText={inputText}
						onInputChange={handleInputChange}
					/>
				);
			case CELL_TYPE.NUMBER:
				return (
					<NumberCellEdit
						menuId={menuId}
						isOpen={isOpen}
						top={cellMenu.top}
						left={cellMenu.left}
						width={cellMenu.width}
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
						isOpen={isOpen}
						top={cellMenu.top}
						left={cellMenu.left}
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
						isOpen={isOpen}
						top={cellMenu.top}
						left={cellMenu.left}
						width={cellMenu.width}
						height={cellMenu.height}
						selectedDate={
							inputText !== "" ? new Date(inputText) : new Date()
						}
						onDateChange={handleDateChange}
					/>
				);
			default:
				return <></>;
		}
	}

	return (
		<td
			className="NLT__td"
			ref={tdRef}
			onClick={handleCellClick}
			onContextMenu={handleCellContextClick}
		>
			{renderCellMenu()}
			<div className="NLT__td-container" style={{ width }}>
				{renderCell()}
			</div>
		</td>
	);
}
