import React, { useEffect, useRef } from "react";

import HeaderMenu from "../HeaderMenu";

import "./styles.css";
import { usePositionRef } from "src/services/hooks";

import { CSS_MEASUREMENT_PIXEL_REGEX } from "src/services/string/regex";
import { numToPx, pxToNum } from "src/services/string/conversion";
import { MIN_COLUMN_WIDTH_PX } from "src/constants";
import { SortDir } from "src/services/sort/types";
import { CellType } from "src/services/table/types";
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";

import parse from "html-react-parser";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import {
	openMenu,
	closeTopLevelMenu,
	isMenuOpen,
} from "src/services/redux/globalSlice";

interface Props {
	cellId: string;
	columnIndex: number;
	columnId: string;
	width: string;
	numColumns: number;
	positionUpdateTime: number;
	content: string;
	textContent: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	sortDir: SortDir;
	type: string;
	onMoveColumnClick: (columnId: string, moveRight: boolean) => void;
	onSortSelect: (columnId: string, sortDir: SortDir) => void;
	onInsertColumnClick: (columnId: string, insertRight: boolean) => void;
	onTypeSelect: (cellId: string, columnId: string, type: CellType) => void;
	onDeleteClick: (columnId: string) => void;
	onSaveClick: (cellId: string, content: string) => void;
	onWidthChange: (columnId: string, width: string) => void;
	onAutoWidthToggle: (columnId: string, value: boolean) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
}

export default function EditableTh({
	cellId,
	columnIndex,
	columnId,
	width,
	positionUpdateTime,
	content,
	textContent,
	useAutoWidth,
	shouldWrapOverflow,
	type,
	sortDir,
	numColumns,
	onWidthChange,
	onInsertColumnClick,
	onMoveColumnClick,
	onSortSelect,
	onTypeSelect,
	onDeleteClick,
	onSaveClick,
	onWrapOverflowToggle,
	onAutoWidthToggle,
}: Props) {
	const { positionRef, position } = usePositionRef([positionUpdateTime]);
	const mouseDownX = useRef(0);
	const isResizing = useRef(false);

	const menu = useMenu(MenuLevel.ONE);
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu));

	function handleHeaderClick(e: React.MouseEvent) {
		if (isResizing.current) return;
		if (isOpen) {
			dispatch(closeTopLevelMenu());
		} else {
			dispatch(openMenu(menu));
		}
	}

	function handleClose() {
		dispatch(closeTopLevelMenu());
	}

	function handleMouseDown(e: React.MouseEvent) {
		mouseDownX.current = e.pageX;
		isResizing.current = true;
	}

	function handleMouseMove(e: MouseEvent) {
		if (width.match(CSS_MEASUREMENT_PIXEL_REGEX)) {
			const oldWidth = pxToNum(width);
			const dist = e.pageX - mouseDownX.current;
			const newWidth = oldWidth + dist;

			if (newWidth < MIN_COLUMN_WIDTH_PX) return;
			onWidthChange(columnId, numToPx(newWidth));
		}
	}

	function handleMouseUp() {
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);
		setTimeout(() => {
			isResizing.current = false;
		}, 100);
	}

	return (
		<>
			<th
				className="NLT__th NLT__selectable"
				ref={positionRef}
				style={{
					width,
				}}
				onClick={handleHeaderClick}
			>
				<div className="NLT__th-container">
					<div className="NLT__th-content">{parse(textContent)}</div>
					<div className="NLT__th-resize-container">
						{!useAutoWidth && (
							<div
								className="NLT__th-resize"
								onMouseDown={(e) => {
									//Prevents drag and drop
									//See: https://stackoverflow.com/questions/704564/disable-drag-and-drop-on-html-elements
									e.preventDefault();
									handleMouseDown(e);
									window.addEventListener(
										"mousemove",
										handleMouseMove
									);
									window.addEventListener(
										"mouseup",
										handleMouseUp
									);
								}}
								onClick={(e) => {
									//Stop propagation so we don't open the header
									e.stopPropagation();
								}}
							/>
						)}
					</div>
				</div>
			</th>
			<HeaderMenu
				isOpen={isOpen}
				canDeleteColumn={numColumns > 1}
				style={{
					top: numToPx(
						pxToNum(position.top) + pxToNum(position.height)
					),
					left: position.left,
				}}
				columnId={columnId}
				cellId={cellId}
				shouldWrapOverflow={shouldWrapOverflow}
				useAutoWidth={useAutoWidth}
				id={menu.id}
				columnContent={content}
				columnSortDir={sortDir}
				columnType={type}
				columnIndex={columnIndex}
				numColumns={numColumns}
				onOutsideClick={onSaveClick}
				onSortSelect={onSortSelect}
				onMoveColumnClick={onMoveColumnClick}
				onInsertColumnClick={onInsertColumnClick}
				onTypeSelect={onTypeSelect}
				onDeleteClick={onDeleteClick}
				onClose={handleClose}
				onAutoWidthToggle={onAutoWidthToggle}
				onWrapOverflowToggle={onWrapOverflowToggle}
			/>
		</>
	);
}
