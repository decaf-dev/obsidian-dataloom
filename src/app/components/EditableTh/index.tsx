import React, { useState, useRef, useCallback } from "react";

import { v4 as uuidv4 } from "uuid";

import { useMenu } from "../MenuProvider";

import HeaderMenu from "../HeaderMenu";

import "./styles.css";
import { MENU_LEVEL } from "src/app/constants";

interface Props {
	id: string;
	index: number;
	width: string;
	content: string;
	sortName: string;
	type: string;
	inFirstHeader: boolean;
	inLastHeader: boolean;
	onMoveColumnClick: (id: string, moveRight: boolean) => void;
	onSortSelect: (id: string, type: string, sortName: string) => void;
	onInsertColumnClick: (id: string, insertRight: boolean) => void;
	onTypeSelect: (id: string, type: string) => void;
	onDeleteClick: (id: string) => void;
	onSaveClick: (id: string, content: string) => void;
	onWidthChange: (id: string, newWidth: number) => void;
}

export default function EditableTh({
	id,
	index,
	width,
	content,
	type,
	sortName,
	inFirstHeader,
	inLastHeader,
	onWidthChange,
	onInsertColumnClick,
	onMoveColumnClick,
	onSortSelect,
	onTypeSelect,
	onDeleteClick,
	onSaveClick,
}: Props) {
	const [headerPosition, setHeaderPosition] = useState({
		top: 0,
		left: 0,
	});
	const dragRef = useRef(false);
	const [menuId] = useState(uuidv4());
	const { isMenuOpen, openMenu, closeMenu } = useMenu();

	function handleHeaderClick(e: React.MouseEvent) {
		if (dragRef.current) return;
		if (isMenuOpen(menuId)) return;
		openMenu(menuId, MENU_LEVEL.ONE);
	}

	function handleMouseMove(e: MouseEvent) {
		const target = e.target;
		if (target instanceof HTMLElement) {
			dragRef.current = true;
			let width = e.pageX - headerPosition.left - 17;
			width = parseInt(width.toString());
			if (width < 100) return;
			onWidthChange(id, width);
		}
	}

	function handleClose() {
		closeMenu(menuId);
	}

	function removeEventListeners() {
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("drag", removeEventListeners);
		window.removeEventListener("mouseup", removeEventListeners);

		setTimeout(() => {
			dragRef.current = false;
		}, 500);
	}

	const thRef = useCallback((node) => {
		if (node) {
			if (node instanceof HTMLElement) {
				setTimeout(() => {
					const { top, left } = node.getBoundingClientRect();
					setHeaderPosition({
						top,
						left,
					});
				}, 1);
			}
		}
	}, []);

	return (
		<th
			className="NLT__th NLT__selectable"
			ref={thRef}
			onClick={handleHeaderClick}
		>
			<HeaderMenu
				isOpen={isMenuOpen(menuId)}
				top={-4}
				left={-11}
				id={id}
				menuId={menuId}
				content={content}
				index={index}
				sortName={sortName}
				type={type}
				inFirstHeader={inFirstHeader}
				inLastHeader={inLastHeader}
				onOutsideClick={onSaveClick}
				onSortSelect={onSortSelect}
				onMoveColumnClick={onMoveColumnClick}
				onInsertColumnClick={onInsertColumnClick}
				onTypeSelect={onTypeSelect}
				onDeleteClick={onDeleteClick}
				onClose={handleClose}
			/>
			<div className="NLT__header-content-container" style={{ width }}>
				<div className="NLT__header-content">{content}</div>
				<div className="NLT__header-resize-container">
					<div
						className="NLT__header-resize"
						onMouseDown={() => {
							window.addEventListener(
								"mousemove",
								handleMouseMove
							);
							window.addEventListener(
								"mouseup",
								removeEventListeners
							);
							window.addEventListener(
								"drag",
								removeEventListeners
							);
						}}
					/>
				</div>
			</div>
		</th>
	);
}
