import React, { useEffect, useRef } from "react";

import HeaderMenu from "../HeaderMenu";

import "./styles.css";
import { useId, usePositionRef } from "src/services/hooks";
import { useMenuId } from "../MenuProvider";

import { CSS_MEASUREMENT_PIXEL_REGEX } from "src/services/string/regex";
import { numToPx, pxToNum } from "src/services/string/conversion";
import { MIN_COLUMN_WIDTH_PX } from "src/constants";
import { SortDir } from "src/services/sort/types";
import { CellType } from "src/services/table/types";

import parse from "html-react-parser";

interface Props {
	cellId: string;
	columnIndex: number;
	width: string;
	numColumns: number;
	positionUpdateTime: number;
	content: string;
	textContent: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	sortDir: SortDir;
	type: string;
	onMoveColumnClick: (columnIndex: number, moveRight: boolean) => void;
	onSortSelect: (columnIndex: number, sortDir: SortDir) => void;
	onInsertColumnClick: (columnIndex: number, insertRight: boolean) => void;
	onTypeSelect: (cellId: string, columnIndex: number, type: CellType) => void;
	onDeleteClick: (columnIndex: number) => void;
	onSaveClick: (cellId: string, content: string) => void;
	onWidthChange: (columnIndex: number, width: string) => void;
	onAutoWidthToggle: (columnIndex: number, value: boolean) => void;
	onWrapOverflowToggle: (columnIndex: number, value: boolean) => void;
}

export default function EditableTh({
	cellId,
	columnIndex,
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
	const menuId = useId();
	const { isMenuOpen, openMenu, closeMenu, isMenuRequestingClose } =
		useMenuId(menuId);
	const { positionRef, position } = usePositionRef([positionUpdateTime]);
	const mouseDownX = useRef(0);
	const isResizing = useRef(false);

	useEffect(() => {
		if (isMenuRequestingClose) {
			closeMenu();
		}
	}, [isMenuRequestingClose]);

	function handleHeaderClick(e: React.MouseEvent) {
		if (isResizing.current) return;
		openMenu();
	}

	function handleClose() {
		closeMenu();
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
			onWidthChange(columnIndex, numToPx(newWidth));
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
				isOpen={isMenuOpen}
				canDeleteColumn={numColumns > 2}
				style={{
					top: numToPx(
						pxToNum(position.top) + pxToNum(position.height)
					),
					left: position.left,
				}}
				cellId={cellId}
				shouldWrapOverflow={shouldWrapOverflow}
				useAutoWidth={useAutoWidth}
				id={menuId}
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
