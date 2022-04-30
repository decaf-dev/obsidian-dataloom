import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForceUpdate } from "src/app/services/hooks";

import HeaderMenu from "../HeaderMenu";

import "./styles.css";

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
	const initialHeaderMenuState = {
		isOpen: false,
		top: 0,
		left: 0,
	};
	const [headerMenu, setHeaderMenu] = useState(initialHeaderMenuState);
	const dragRef = useRef(false);
	const thRef = useRef(null);
	const forceUpdate = useForceUpdate();

	function handleKeyUp(e: React.KeyboardEvent) {
		if (e.key === "Enter") openMenu();
	}

	function handleHeaderClick() {
		if (dragRef.current) return;
		openMenu();
	}

	function openMenu() {
		setHeaderMenu({
			left: -10,
			top: -5,
			isOpen: true,
		});
	}

	function handleMouseMove(e: MouseEvent) {
		const target = e.target;
		if (target instanceof HTMLElement) {
			dragRef.current = true;
			const width =
				e.pageX - thRef.current.getBoundingClientRect().left - 17;
			if (width < 100) return;
			onWidthChange(id, width);
		}
	}

	function removeEventListeners() {
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("drag", removeEventListeners);
		window.removeEventListener("mouseup", removeEventListeners);

		setTimeout(() => {
			dragRef.current = false;
		}, 500);
	}

	useEffect(() => {
		forceUpdate();
	}, [forceUpdate]);

	return (
		<th
			tabIndex={0}
			className="NLT__th NLT__selectable"
			ref={thRef}
			onKeyUp={handleKeyUp}
			onClick={handleHeaderClick}
		>
			<HeaderMenu
				isOpen={headerMenu.isOpen}
				style={{
					top: headerMenu.top,
					left: headerMenu.left,
				}}
				id={id}
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
				onClose={() => setHeaderMenu(initialHeaderMenuState)}
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
