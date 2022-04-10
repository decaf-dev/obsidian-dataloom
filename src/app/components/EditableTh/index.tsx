import React, { useState } from "react";

import HeaderMenu from "../HeaderMenu";
import ArrowGroup from "../ArrowGroup";

import "./styles.css";

interface Props {
	id: string;
	position: number;
	content: string;
	type: string;
	arrow: string;
	onArrowClick: (
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
	onArrowClick,
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
			top: -10,
			isOpen: true,
		});
	}

	function handleOutsideClick() {
		setHeaderMenu(initialHeaderMenuState);
		onSaveClick(id, content);
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
				onOutsideClick={handleOutsideClick}
				onItemClick={onItemClick}
				onDeleteClick={onDeleteClick}
				onClose={() => setHeaderMenu(initialHeaderMenuState)}
			/>
			<div className="NLT__header-content">{content}</div>
			<ArrowGroup
				selected={arrow}
				onArrowClick={(arrow) =>
					onArrowClick(id, position, type, arrow)
				}
			/>
		</div>
	);
}
