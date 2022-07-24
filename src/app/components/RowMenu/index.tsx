import React, { useEffect, useMemo } from "react";

import IconButton from "../IconButton";
import Menu from "../Menu";
import RowMenuItem from "./components/RowMenuItem";
import { useMenuId } from "../MenuProvider";

import { Icon } from "src/app/services/icon/types";
import { usePositionRef } from "src/app/services/hooks";
import { useDisableScroll, useId } from "src/app/services/hooks";
import { numToPx, pxToNum } from "src/app/services/string/parsers";

import "./styles.css";

interface Props {
	rowId: string;
	headerWidthUpdateTime: number;
	tableScrollUpdateTime: number;
	hideInsertOptions: boolean;
	hideMoveOptions: boolean;
	sortUpdateTime: number;
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
	hideInsertOptions,
	hideMoveOptions,
	sortUpdateTime,
	onMoveRowClick,
	onDeleteClick,
	onInsertRowClick,
}: Props) {
	const menuId = useId();
	const { isMenuOpen, openMenu, closeMenu, isMenuRequestingClose } =
		useMenuId(menuId);

	const { positionRef, position } = usePositionRef([
		headerWidthUpdateTime,
		tableScrollUpdateTime,
		sortUpdateTime,
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

	const options = useMemo(() => {
		return [
			{
				name: "move-up",
				content: "Move Up",
				icon: Icon.MOVE_UP,
				hide: isFirstRow || hideMoveOptions,
				onClick: () => handleMoveRowClick(rowId, false),
			},
			{
				name: "move-down",
				content: "Move Down",
				icon: Icon.MOVE_DOWN,
				hide: isLastRow || hideMoveOptions,
				onClick: () => handleMoveRowClick(rowId, true),
			},
			{
				name: "insert-above",
				content: "Insert Above",
				hide: hideInsertOptions,
				icon: Icon.KEYBOARD_DOUBLE_ARROW_UP,
				onClick: () => handleInsertRowClick(rowId, false),
			},
			{
				name: "insert-below",
				content: "Insert Below",
				icon: Icon.KEYBOARD_DOUBLE_ARROW_DOWN,
				hide: hideInsertOptions,
				onClick: () => handleInsertRowClick(rowId, true),
			},
			{
				name: "delete",
				content: "Delete",
				icon: Icon.DELETE,
				onClick: () => handleDeleteClick(rowId),
			},
		];
	}, [hideInsertOptions, hideMoveOptions, rowId, isFirstRow, isLastRow]);

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
					{options
						.filter((option) => !option.hide)
						.map((item) => {
							return (
								<RowMenuItem
									key={item.name}
									icon={item.icon}
									iconText={item.content}
									onClick={item.onClick}
								/>
							);
						})}
				</div>
			</Menu>
		</div>
	);
}
