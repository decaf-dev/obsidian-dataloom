import React, { useEffect, useState } from "react";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

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
	onInsertColumnClick: (id: string, insertRight: boolean) => void;
	onTypeSelect: (id: string, type: string) => void;
	onSortSelect: (id: string, type: string, sortName: string) => void;
	onDeleteClick: (id: string) => void;
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
	onInsertColumnClick,
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
						handleTypeSelect(id, item.type);
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
						handleSortSelect(id, type, item.name);
					}}
				>
					{item.icon} Sort {item.content}
				</p>
			);
		});
	}

	function renderInsertItems() {
		return (
			<>
				<div
					className="NLT__header-menu-item NLT__selectable"
					onClick={(e) => {
						e.stopPropagation();
						handleInsertColumnClick(id, false);
					}}
				>
					<ArrowLeftIcon /> Insert Left
				</div>
				<div
					className="NLT__header-menu-item NLT__selectable"
					onClick={(e) => {
						e.stopPropagation();
						handleInsertColumnClick(id, true);
					}}
				>
					<ArrowRightIcon /> Insert Right
				</div>
			</>
		);
	}

	function handleSortSelect(id: string, type: string, sortName: string) {
		onSortSelect(id, type, sortName);
		onClose();
	}

	function handleInsertColumnClick(id: string, insertRight: boolean) {
		onClose();
		onInsertColumnClick(id, insertRight);
	}

	function handleTypeSelect(id: string, type: string) {
		onTypeSelect(id, type);
		onClose();
	}

	function handleOutsideClick(id: string, text: string) {
		//If we're in Live Preview mode and we click on the header and then click on the outside of
		//the component, the header will close, set the data (which didn't change), which cause an update
		//which persists the data again. We can prevent this by only calling onOutsideClick
		//if the data has actually changed
		if (text !== content) onOutsideClick(id, text);
		onClose();
	}

	function handleDeleteClick(id: string) {
		onDeleteClick(id);
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
					<div className="NLT__header-menu-header">Insert</div>
					{renderInsertItems()}
					<div className="NLT__header-menu-header">Property Type</div>
					{renderMenuItems()}
					<button
						className="NLT__button"
						onClick={() => handleDeleteClick(id)}
					>
						Delete
					</button>
				</div>
			}
			onOutsideClick={() => handleOutsideClick(id, inputText)}
		/>
	);
}
