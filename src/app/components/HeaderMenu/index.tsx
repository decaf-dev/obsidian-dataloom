import React, { useEffect, useState } from "react";

import Menu from "../Menu";

import { SORT, MENU_ITEMS } from "./constants";

import "./styles.css";

interface Props {
	isOpen: boolean;
	style: object;
	id: string;
	index: number;
	sortName: string;
	content: string;
	type: string;
	onTypeSelect: (id: string, index: number, type: string) => void;
	onSortSelect: (
		id: string,
		index: number,
		type: string,
		sortName: string
	) => void;
	onDeleteClick: (id: string, index: number) => void;
	onOutsideClick: (id: string, inputText: string) => void;
	onClose: () => void;
}

export default function HeaderMenu({
	isOpen,
	style,
	id,
	index,
	content,
	type,
	sortName,
	onTypeSelect,
	onSortSelect,
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
			let className = "NLT__header-menu-item NLT__selectable";
			if (item.type === type) className += " NLT__selected";
			return (
				<p
					key={item.name}
					className={className}
					onClick={(e) => {
						e.stopPropagation();
						handleTypeSelect(id, index, item.type);
					}}
				>
					{item.content}
				</p>
			);
		});
	}

	function renderSortItems() {
		return Object.values(SORT).map((item) => {
			let className = "NLT__header-menu-item NLT__selectable";
			if (sortName === item.name) className += " NLT__selected";
			return (
				<p
					key={item.name}
					className={className}
					onClick={(e) => {
						e.stopPropagation();
						handleSortSelect(id, index, type, item.name);
					}}
				>
					{item.icon} Sort {item.content}
				</p>
			);
		});
	}

	function handleSortSelect(
		id: string,
		index: number,
		type: string,
		sortName: string
	) {
		onSortSelect(id, index, type, sortName);
		onClose();
	}

	function handleTypeSelect(id: string, index: number, type: string) {
		onTypeSelect(id, index, type);
		onClose();
	}

	function handleOutsideClick(id: string, text: string) {
		onOutsideClick(id, text);
		onClose();
	}

	function handleDeleteClick(id: string, index: number) {
		onDeleteClick(id, index);
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
					<div className="NLT__header-menu-header">Sort</div>
					{renderSortItems()}
					<div className="NLT__header-menu-header">Property Type</div>
					{renderMenuItems()}
					<button
						className="NLT__button"
						onClick={() => handleDeleteClick(id, index)}
					>
						Delete
					</button>
				</div>
			}
			onOutsideClick={() => handleOutsideClick(id, inputText)}
		/>
	);
}
