import React, { useRef } from "react";

import HeaderMenu from "../HeaderMenu";

import "./styles.css";
import { usePositionRef } from "src/services/hooks";

import { CSS_MEASUREMENT_PIXEL_REGEX } from "src/services/string/regex";
import { numToPx, pxToNum } from "src/services/string/conversion";
import { SortDir } from "src/services/sort/types";
import { CellType } from "src/services/table/types";
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import { MIN_COLUMN_WIDTH } from "src/services/table/constants";

import parse from "html-react-parser";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import {
	openMenu,
	closeTopLevelMenu,
	isMenuOpen,
} from "src/services/menu/menuSlice";

interface Props {
	cellId: string;
	columnIndex: number;
	columnId: string;
	width: string;
	numColumns: number;
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
	const mouseDownX = useRef(0);
	const isResizing = useRef(false);

	const menu = useMenu(MenuLevel.ONE);
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu));
	const positionUpdateTime = useAppSelector(
		(state) => state.menu.positionUpdateTime
	);
	const { positionRef, position } = usePositionRef([positionUpdateTime]);

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

			if (newWidth < MIN_COLUMN_WIDTH) return;
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
				onClick={handleHeaderClick}
			>
				<div
					className="NLT__th-container"
					style={{
						width,
					}}
				>
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
