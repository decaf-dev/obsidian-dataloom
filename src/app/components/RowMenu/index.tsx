import React, { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import IconButton from "../IconButton";
import Menu from "../Menu";

import RowMenuItem from "./components/RowMenuItem";

import "./styles.css";
import { DRAG_MENU_ITEM } from "./constants";
import { ICON, MENU_LEVEL } from "src/app/constants";
import { useMenu } from "../MenuProvider";
interface Props {
	rowId: string;
	isFirstRow: boolean;
	isLastRow: boolean;
	onMoveRowClick: (id: string, moveBelow: boolean) => void;
	onDeleteClick: (id: string) => void;
	onInsertRowClick: (id: string, insertBelow: boolean) => void;
}

export default function RowMenu({
	rowId,
	isFirstRow,
	isLastRow,
	onMoveRowClick,
	onDeleteClick,
	onInsertRowClick,
}: Props) {
	const [menuId] = useState(uuidv4());
	const [buttonId] = useState(uuidv4());
	const [resizeTime, setResizeTime] = useState(0);
	const [menuPosition, setMenuPosition] = useState({
		top: 0,
		left: 0,
	});
	const { isMenuOpen, openMenu, closeMenu } = useMenu();

	function handleButtonClick(e: React.MouseEvent) {
		if (isMenuOpen(menuId)) return;
		openMenu(menuId, MENU_LEVEL.ONE);
	}

	function handleDeleteClick(id: string) {
		onDeleteClick(id);
		closeMenu(menuId);
	}

	function handleInsertRowClick(id: string, insertBelow: boolean) {
		onInsertRowClick(id, insertBelow);
		closeMenu(menuId);
	}

	function handleMoveRowClick(id: string, moveBelow: boolean) {
		onMoveRowClick(id, moveBelow);
		closeMenu(menuId);
	}

	const divRef = useCallback(
		(node) => {
			if (node) {
				if (node instanceof HTMLElement) {
					setTimeout(() => {
						const { top, left, width, height } =
							node.getBoundingClientRect();
						setMenuPosition({
							top: top + height,
							left: left - width - 60,
						});
					}, 1);
				}
			}
		},
		[isMenuOpen(menuId)]
	);

	return (
		<div ref={divRef}>
			<IconButton
				id={buttonId}
				icon={ICON.MORE_VERT}
				onClick={handleButtonClick}
			/>
			<Menu
				id={menuId}
				isOpen={isMenuOpen(menuId)}
				top={menuPosition.top}
				left={menuPosition.left}
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
							<RowMenuItem
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
										case DRAG_MENU_ITEM.INSERT_ABOVE.name:
											handleInsertRowClick(rowId, false);
											break;
										case DRAG_MENU_ITEM.INSERT_BELOW.name:
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
		</div>
	);
}
