import React, { useEffect } from "react";

import IconButton from "../IconButton";
import Menu from "../Menu";

import RowMenuItem from "./components/RowMenuItem";

import "./styles.css";
import { DRAG_MENU_ITEM } from "./constants";
import { Icon } from "src/app/services/icon/types";
import { usePositionRef } from "src/app/services/hooks";
import { useMenu } from "../MenuProvider";
import { useDisableScroll, useMenuId } from "src/app/services/hooks";
import { numToPx, pxToNum } from "src/app/services/string/parsers";

interface Props {
	rowId: string;
	headerWidthUpdateTime: number;
	tableScrollUpdateTime: number;
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
	headerWidthUpdateTime,
	tableScrollUpdateTime,
	onMoveRowClick,
	onDeleteClick,
	onInsertRowClick,
}: Props) {
	const menuId = useMenuId();
	const { isMenuOpen, openMenu, closeMenu, isMenuRequestingClose } =
		useMenu(menuId);

	const { positionRef, position } = usePositionRef([
		headerWidthUpdateTime,
		tableScrollUpdateTime,
	]);

	useEffect(() => {
		if (isMenuRequestingClose) {
			closeMenu();
		}
	}, [isMenuRequestingClose]);

	useDisableScroll(isMenuOpen);

	function handleButtonClick(e: React.MouseEvent) {
		openMenu();
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
		<div ref={positionRef}>
			<IconButton icon={Icon.MORE_VERT} onClick={handleButtonClick} />
			<Menu
				id={menuId}
				isOpen={isMenuOpen}
				style={{
					top: numToPx(
						pxToNum(position.top) + pxToNum(position.height)
					),
					left: numToPx(
						pxToNum(position.left) - pxToNum(position.width) - 65
					),
				}}
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
