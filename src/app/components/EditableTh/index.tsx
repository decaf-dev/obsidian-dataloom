import React, { useEffect, useRef } from "react";

import HeaderMenu from "../HeaderMenu";

import "./styles.css";
import { MENU_LEVEL } from "src/app/constants";
import {
	useDisableScroll,
	useMenuId,
	useMenuRef,
} from "src/app/services/hooks";

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
	const menuId = useMenuId();
	const mouseDownX = useRef(0);
	const {
		menuPosition,
		menuRef,
		isMenuOpen,
		openMenu,
		closeMenu,
		isMenuRequestingClose,
	} = useMenuRef(menuId, MENU_LEVEL.ONE);
	useDisableScroll(isMenuOpen);

	useEffect(() => {
		if (isMenuRequestingClose) {
			closeMenu();
		}
	}, [isMenuRequestingClose]);

	function handleHeaderClick(e: React.MouseEvent) {
		openMenu();
	}

	function handleClose() {
		closeMenu();
	}

	function handleMouseDown(e: React.MouseEvent) {
		mouseDownX.current = e.pageX;
	}

	function handleMouseMove(e: MouseEvent) {
		if (typeof width === "number") {
			const dist = e.pageX - mouseDownX.current;
			const newWidth = width + dist;

			//Keep a min-width of 50px
			if (newWidth < 50) return;
			onWidthChange(id, newWidth);
		}
	}

	function handleMouseUp(e: MouseEvent) {
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);
	}

	return (
		<>
			<th
				className="NLT__th NLT__selectable"
				ref={menuRef}
				style={{ width }}
				onClick={handleHeaderClick}
			>
				<div className="NLT__th-container">
					<div className="NLT__th-content">{content}</div>
					<div className="NLT__th-resize-container">
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
					</div>
				</div>
			</th>
			<HeaderMenu
				isOpen={isMenuOpen}
				top={menuPosition.top}
				left={menuPosition.left}
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
		</>
	);
}
