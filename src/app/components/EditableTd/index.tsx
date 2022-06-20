import React, { useState, useEffect } from "react";

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
import { isDate } from "src/app/services/string/validators";

import "./styles.css";

import { CELL_TYPE, DEBUG, MENU_LEVEL } from "../../constants";
import {
	useDisableScroll,
	useMenuId,
	useMenuRef,
} from "src/app/services/hooks";

interface Props {
	headerType: string;
	cell: Cell;
	width: string;
	tags: Tag[];
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onTagClick: (cellId: string, tagId: string) => void;
	onContentChange: (cellId: string, headerType: string, content: any) => void;
	onAddTag: (
		cellId: string,
		headerId: string,
		inputText: string,
		color: string
	) => void;
	onColorChange: (tagId: string, color: string) => void;
	onSaveContent: () => void;
}

export default function EditableTd({
	headerType,
	cell,
	width,
	tags,
	onRemoveTagClick,
	onColorChange,
	onTagClick,
	onContentChange,
	onSaveContent,
	onAddTag,
}: Props) {
	const [tagColor] = useState(randomColor());
	const [tagInputText, setTagInputText] = useState("");

	const menuId = useMenuId();
	const content = cell.toString();
	const {
		menuPosition,
		menuRef,
		isMenuOpen,
		openMenu,
		closeMenu,
		isMenuRequestingClose,
	} = useMenuRef(menuId, MENU_LEVEL.ONE, content);

	useDisableScroll(isMenuOpen);

	const { id, headerId, type } = cell;

	const [wasContentUpdated, setContentUpdate] = useState(false);
	const isInvalidContent = type !== headerType;

	useEffect(() => {
		if (isMenuRequestingClose) {
			// if (headerType === CELL_TYPE.TAG && !wasContentUpdated) {
			// 	if (tagInputText !== "") {
			// 		const tag = tags.find(
			// 			(tag) => tag.content === addPound(tagInputText)
			// 		);
			// 		if (tag) {
			// 			onTagClick(id, tag.id);
			// 		} else {
			// 			onAddTag(
			// 				id,
			// 				headerId,
			// 				addPound(tagInputText),
			// 				tagColor
			// 			);
			// 		}
			// 		setTagInputText("");
			// 		// setContentUpdate(true);
			// 	}
			// } else {
			closeMenu();
			//If we're just closing the menun from an outside click,
			//then don't save unless the content actually updated
			if (wasContentUpdated) {
				onSaveContent();
			}
			// }
		}
	}, [isMenuRequestingClose]);

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
		openMenu();
	}

	function handleAddTag(value: string) {
		onAddTag(id, headerId, value, tagColor);
		setContentUpdate(true);
	}

	function handleTagClick(tagId: string) {
		onTagClick(id, tagId);
		setContentUpdate(true);
	}

	function handleTextInputChange(value: string) {
		onContentChange(id, headerType, value);
		setContentUpdate(true);
	}

	function handleNumberInputChange(value: string) {
		onContentChange(id, headerType, value);
		setContentUpdate(true);
	}

	function handleDateChange(date: Date) {
		console.log("Handle date change!");
		onContentChange(id, headerType, date);
		setContentUpdate(true);
	}

	function handleCheckboxChange(isChecked: boolean) {
		onContentChange(id, headerType, isChecked);
		setContentUpdate(true);
	}

	function renderCell(): React.ReactNode {
		if (isInvalidContent) {
			return <ErrorCell expectedType={headerType} type={type} />;
		}
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
			default:
				return <></>;
		}
	}

	function renderCellMenu() {
		switch (headerType) {
			case CELL_TYPE.TEXT:
				return (
					<TextCellEdit
						menuId={menuId}
						isOpen={isMenuOpen}
						top={menuPosition.top}
						left={menuPosition.left}
						width={menuPosition.width}
						height={menuPosition.height}
						value={content}
						onInputChange={handleTextInputChange}
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
						height={menuPosition.height}
						value={content}
						onInputChange={handleNumberInputChange}
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
						color={tagColor}
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
							isDate(content) ? new Date(content) : new Date()
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
			<div className="NLT__td-container" style={{ width }}>
				{renderCell()}
			</div>
			{renderCellMenu()}
		</td>
	);
}
