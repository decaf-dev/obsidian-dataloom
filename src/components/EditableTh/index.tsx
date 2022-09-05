import React, { useEffect, useRef } from "react";

import HeaderMenu from "../HeaderMenu";

import "./styles.css";
import { useId, usePositionRef } from "src/services/hooks";
import { useMenuId } from "../MenuProvider";

import { CSS_MEASUREMENT_PIXEL_REGEX } from "src/services/string/regex";
import { numToPx, pxToNum } from "src/services/string/conversion";
import { MIN_COLUMN_WIDTH_PX } from "src/constants";
import { SortDir } from "src/services/sort/types";
import { CellType } from "src/services/appData/state/types";
interface Props {
	id: string;
	index: number;
	width: string;
	numHeaders: number;
	positionUpdateTime: number;
	content: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	sortDir: SortDir;
	type: string;
	onMoveColumnClick: (id: string, moveRight: boolean) => void;
	onSortSelect: (id: string, sortDir: SortDir) => void;
	onInsertColumnClick: (id: string, insertRight: boolean) => void;
	onTypeSelect: (id: string, type: CellType) => void;
	onDeleteClick: (id: string) => void;
	onSaveClick: (id: string, content: string) => void;
	onWidthChange: (id: string, width: string) => void;
	onAutoWidthToggle: (id: string, value: boolean) => void;
	onWrapOverflowToggle: (id: string, value: boolean) => void;
}

export default function EditableTh({
	id,
	index,
	width,
	positionUpdateTime,
	content,
	useAutoWidth,
	shouldWrapOverflow,
	type,
	sortDir,
	numHeaders,
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
			onWidthChange(id, numToPx(newWidth));
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
					<div className="NLT__th-content">{content}</div>
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
				style={{
					top: numToPx(
						pxToNum(position.top) + pxToNum(position.height)
					),
					left: position.left,
				}}
				headerId={id}
				shouldWrapOverflow={shouldWrapOverflow}
				useAutoWidth={useAutoWidth}
				id={menuId}
				headerName={content}
				index={index}
				headerSortDir={sortDir}
				headerType={type}
				headerIndex={index}
				numHeaders={numHeaders}
				onOutsideClick={onSaveClick}
				onSortSelect={onSortSelect}
				onMoveColumnClick={onMoveColumnClick}
				onInsertColumnClick={onInsertColumnClick}
				onTypeSelect={onTypeSelect}
				onHeaderDeleteClick={onDeleteClick}
				onClose={handleClose}
				onAutoWidthToggle={onAutoWidthToggle}
				onWrapOverflowToggle={onWrapOverflowToggle}
			/>
		</>
	);
}
