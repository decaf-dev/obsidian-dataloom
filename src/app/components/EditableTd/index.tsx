import React, { useState, useEffect, useCallback, useRef } from "react";

import { Notice } from "obsidian";
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

import { randomColor } from "src/app/services/random";
import { Tag } from "src/app/services/appData/state/tag";
import { Cell } from "src/app/services/appData/state/cell";
import { parseDateForInput } from "src/app/services/string/parsers";

import "./styles.css";

import { CELL_TYPE, DEBUG, MENU_LEVEL } from "../../constants";
import {
	useDisableScroll,
	useMenuId,
	useMenuRef,
} from "src/app/services/hooks";

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
	const didMount = useRef(false);

	const [tagColor] = useState(randomColor());

	const menuId = useMenuId();
	const {
		menuPosition,
		menuRef,
		isMenuOpen,
		openMenu,
		canOpenMenu,
		closeMenu,
	} = useMenuRef(menuId, MENU_LEVEL.ONE);

	useDisableScroll(isMenuOpen);

	const { id, headerId, type, expectedType } = cell;
	const content = cell.toString();

	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
		} else {
			if (!isMenuOpen) {
				if (DEBUG.EDITABLE_TD.USE_EFFECT)
					console.log(
						`[EditableTd] useEffect(updateContent("${inputText}"))`
					);
				updateContent(inputText);
			}
		}
	}, [didMount.current, isMenuOpen]);

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
		//If the cell is an error return
		if (type === CELL_TYPE.ERROR) return;

		if (canOpenMenu()) {
			openMenu();
		}
	}

	function handleAddTag(text: string) {
		if (DEBUG.EDITABLE_TD.HANDLER)
			console.log(`[EditableTd] handleAddTag("${text}")`);
		onAddTag(id, headerId, text, tagColor);
		setInputText("");
		closeMenu();
	}

	function handleTagClick(tagId: string) {
		if (DEBUG.EDITABLE_TD.HANDLER)
			console.log(`[EditableTd] handleTagClick("${tagId}")`);
		onTagClick(id, tagId);
		closeMenu();
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
						onAddTag(id, headerId, inputText, tagColor);
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
						isOpen={isMenuOpen}
						top={menuPosition.top}
						left={menuPosition.left}
						width={menuPosition.width}
						inputText={inputText}
						onInputChange={handleInputChange}
					/>
				);
			case CELL_TYPE.NUMBER:
				return (
					<NumberCellEdit
						menuId={menuId}
						isOpen={isMenuOpen}
						top={menuPosition.top}
						left={menuPosition.left}
						width={menuPosition.width}
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
						isOpen={isMenuOpen}
						top={menuPosition.top}
						left={menuPosition.left}
						inputText={inputText}
						color={tagColor}
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
						isOpen={isMenuOpen}
						top={menuPosition.top}
						left={menuPosition.left}
						width={menuPosition.width}
						height={menuPosition.height}
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
			ref={menuRef}
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
