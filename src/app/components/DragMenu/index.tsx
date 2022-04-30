import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import IconButton from "../IconButton";
import Menu from "../Menu";

import DragMenuItem from "./components/DragMenuItem";

import "./styles.css";
import { DRAG_MENU_ITEM } from "./constants";
import { ICON } from "src/app/constants";

interface Props {
	rowId: string;
	isFirstRow: boolean;
	isLastRow: boolean;
	onMoveRowClick: (id: string, moveBelow: boolean) => void;
	onDeleteClick: (id: string) => void;
	onInsertRowClick: (id: string, insertBelow: boolean) => void;
}

export default function DragMenu({
	rowId,
	isFirstRow,
	isLastRow,
	onMoveRowClick,
	onDeleteClick,
	onInsertRowClick,
}: Props) {
	const initialdragMenu = {
		top: 0,
		left: 0,
		isOpen: false,
	};
	const [dragMenu, setDragMenu] = useState(initialdragMenu);
	const [buttonId] = useState(uuidv4());

	const buttonRef = useRef<HTMLInputElement>();

	function handleButtonClick() {
		openMenu();
	}

	function handleKeyUp(e: React.KeyboardEvent) {
		if (e.key === "Enter") openMenu();
	}

	function handleOutsideClick(e: MouseEvent | null) {
		closeMenu();
	}

	function openMenu() {
		if (dragMenu.isOpen) {
			setDragMenu(initialdragMenu);
			return;
		}
		if (buttonRef.current) {
			const { width, height } = buttonRef.current.getBoundingClientRect();

			setDragMenu({
				left: -width - 62,
				top: -height,
				isOpen: true,
			});
		}
	}

	function closeMenu() {
		setDragMenu(initialdragMenu);
	}

	function handleDeleteClick(id: string) {
		onDeleteClick(id);
		closeMenu();
	}

	function handleInsertRowClick(id: string, insertBelow: boolean) {
		onInsertRowClick(id, insertBelow);
		closeMenu();
	}

	function handleMoveRowClick(id: string, moveBelow: boolean) {
		onMoveRowClick(id, moveBelow);
		closeMenu();
	}

	return (
		<>
			<IconButton
				id={buttonId}
				icon={ICON.MORE_VERT}
				ref={buttonRef}
				onKeyUp={handleKeyUp}
				onClick={handleButtonClick}
			/>
			<Menu
				isOpen={dragMenu.isOpen}
				style={{
					top: `${dragMenu.top}px`,
					left: `${dragMenu.left}px`,
				}}
				onOutsideClick={handleOutsideClick}
			>
				<div className="NLT__drag-menu">
					{Object.values(DRAG_MENU_ITEM).map((item) => {
						if (item.name === DRAG_MENU_ITEM.MOVE_UP.name) {
							if (isFirstRow) return;
						}
						if (item.name === DRAG_MENU_ITEM.MOVE_DOWN.name) {
							if (isLastRow) return;
						}
						return (
							<DragMenuItem
								key={item.name}
								icon={item.icon}
								iconText={item.content}
								onClick={() => {
									switch (item.name) {
										case DRAG_MENU_ITEM.MOVE_UP.name:
											handleMoveRowClick(rowId, false);
											break;
										case DRAG_MENU_ITEM.MOVE_DOWN.name:
											handleMoveRowClick(rowId, true);
											break;
										case DRAG_MENU_ITEM.INSERT_UP.name:
											handleInsertRowClick(rowId, false);
											break;
										case DRAG_MENU_ITEM.INSERT_DOWN.name:
											handleInsertRowClick(rowId, true);
											break;
										case DRAG_MENU_ITEM.DELETE.name:
											handleDeleteClick(rowId);
											break;
									}
								}}
							/>
						);
					})}
				</div>
			</Menu>
		</>
	);
}
