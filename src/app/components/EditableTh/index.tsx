import React, { useState } from "react";

import HeaderMenu from "../HeaderMenu";
import SortButton from "../SortButton";

import "./styles.css";

interface Props {
	id: string;
	position: number;
	content: string;
	type: string;
	arrow: string;
	onSortClick: (
		id: string,
		position: number,
		type: string,
		arrow: string
	) => void;
	onItemClick: (
		headerId: string,
		headerPosition: number,
		headerType: string
	) => void;
	onDeleteClick: (headerId: string, headerPosition: number) => void;
	onSaveClick: (headerId: string, content: string) => void;
}

export default function EditableTh({
	id,
	position,
	content,
	type,
	arrow,
	onSortClick,
	onItemClick,
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
		<div className="NLT__header-group" onClick={handleHeaderClick}>
			<HeaderMenu
				isOpen={headerMenu.isOpen}
				style={{
					top: headerMenu.top,
					left: headerMenu.left,
				}}
				id={id}
				content={content}
				position={position}
				type={type}
				onOutsideClick={onSaveClick}
				onItemClick={onItemClick}
				onDeleteClick={onDeleteClick}
				onClose={() => setHeaderMenu(initialHeaderMenuState)}
			/>
			<div className="NLT__header-content">{content}</div>
			<SortButton
				selected={arrow}
				onClick={(arrow) => onSortClick(id, position, type, arrow)}
			/>
		</div>
	);
}
