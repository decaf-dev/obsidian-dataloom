import React, { useEffect, useState } from "react";

import Menu from "../Menu";

import "./styles.css";

import { MENU_ITEMS } from "./constants";

interface Props {
	isOpen: boolean;
	style: object;
	id: string;
	position: number;
	content: string;
	type: string;
	onItemClick: (
		headerId: string,
		headerPosition: number,
		cellType: string
	) => void;
	onDeleteClick: (headerId: string, headerPosition: number) => void;
	onOutsideClick: (headerId: string, inputText: string) => void;
	onClose: () => void;
}

export default function HeaderMenu({
	isOpen,
	style,
	id,
	position,
	content,
	type,
	onItemClick,
	onDeleteClick,
	onOutsideClick,
	onClose,
}: Props) {
	const [inputText, setInputText] = useState("");

	useEffect(() => {
		setInputText(content);
	}, [content]);

	function renderMenuItems() {
		return MENU_ITEMS.map((item) => {
			let className = "NLT__header-menu-item";
			if (item.type === type) className += " NLT__selected";
			return (
				<p
					key={item.name}
					className={className}
					onClick={() => handleItemClick(id, position, item.type)}
				>
					{item.content}
				</p>
			);
		});
	}

	function handleItemClick(id: string, position: number, type: string) {
		onItemClick(id, position, type);
		onClose();
	}

	function handleOutsideClick(id: string, text: string) {
		onOutsideClick(id, text);
		onClose();
	}

	function handleDeleteClick(id: string, position: number) {
		onDeleteClick(id, position);
		onClose();
	}

	return (
		<Menu
			isOpen={isOpen}
			style={style}
			content={
				<div className="NLT__header-menu-container">
					<input
						autoFocus
						type="text"
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
					/>
					<div className="NLT__header-menu-header">Property Type</div>
					{renderMenuItems()}
					<button
						className="NLT__button"
						onClick={() => handleDeleteClick(id, position)}
					>
						Delete
					</button>
				</div>
			}
			onOutsideClick={() => handleOutsideClick(id, inputText)}
		/>
	);
}
