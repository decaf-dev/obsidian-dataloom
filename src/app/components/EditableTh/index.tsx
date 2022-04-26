import React, { useState } from "react";

import HeaderMenu from "../HeaderMenu";

import "./styles.css";

interface Props {
	id: string;
	index: number;
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
}

export default function EditableTh({
	id,
	index,
	content,
	type,
	sortName,
	inFirstHeader,
	inLastHeader,
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

	function handleHeaderClick() {
		setHeaderMenu({
			left: -10,
			top: -5,
			isOpen: true,
		});
	}

	return (
		<th className="NLT__th NLT__selectable" onClick={handleHeaderClick}>
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
			<div className="NLT__header-content">{content}</div>
		</th>
	);
}
