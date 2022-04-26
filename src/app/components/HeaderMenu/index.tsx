import React, { useEffect, useState } from "react";
import IconText from "../IconText";

import Menu from "../Menu";

import { SORT, MENU_ITEMS } from "./constants";
import { ICON } from "../../constants";

import "./styles.css";
import HeaderMenuItem from "./components/HeaderMenuItem";

interface Props {
	isOpen: boolean;
	style: object;
	id: string;
	index: number;
	sortName: string;
	content: string;
	type: string;
	inFirstHeader: boolean;
	inLastHeader: boolean;
	onInsertColumnClick: (id: string, insertRight: boolean) => void;
	onMoveColumnClick: (id: string, moveRight: boolean) => void;
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
	content,
	type,
	sortName,
	inFirstHeader,
	inLastHeader,
	onTypeSelect,
	onSortSelect,
	onDeleteClick,
	onOutsideClick,
	onInsertColumnClick,
	onMoveColumnClick,
	onClose,
}: Props) {
	//TODO refactor this code and make it more neat
	const [inputText, setInputText] = useState("");

	useEffect(() => {
		setInputText(content);
	}, [content]);

	function renderMenuItems() {
		return MENU_ITEMS.map((item) => {
			return (
				<HeaderMenuItem
					key={item.name}
					icon=""
					iconText={item.content}
					onClick={() => handleTypeSelect(id, item.type)}
					selected={item.type === type}
				/>
			);
		});
	}

	function renderSortItems() {
		return (
			<ul className="NLT__header-menu-ul">
				{Object.values(SORT).map((item) => (
					<HeaderMenuItem
						key={item.name}
						icon={item.icon}
						iconText={`Sort ${item.content}`}
						onClick={() => handleSortSelect(id, type, item.name)}
						selected={sortName === item.name}
					/>
				))}
			</ul>
		);
	}

	function renderInsertItems() {
		return (
			<ul className="NLT__header-menu-ul">
				<HeaderMenuItem
					icon={ICON.KEYBOARD_ARROW_LEFT}
					iconText="Insert Left"
					onClick={() => handleInsertColumnClick(id, false)}
				/>
				<HeaderMenuItem
					icon={ICON.KEYBOARD_ARROW_RIGHT}
					iconText="Insert Right"
					onClick={() => handleInsertColumnClick(id, true)}
				/>
			</ul>
		);
	}

	function renderMoveItems() {
		return (
			<ul className="NLT__header-menu-ul">
				{!inFirstHeader && (
					<HeaderMenuItem
						icon={ICON.KEYBOARD_DOUBLE_ARROW_LEFT}
						iconText="Move Left"
						onClick={() => handleMoveColumnClick(id, false)}
					/>
				)}
				{!inLastHeader && (
					<HeaderMenuItem
						icon={ICON.KEYBOARD_DOUBLE_ARROW_RIGHT}
						iconText="Move Right"
						onClick={() => handleMoveColumnClick(id, true)}
					/>
				)}
			</ul>
		);
	}

	function handleMoveColumnClick(id: string, moveRight: boolean) {
		onMoveColumnClick(id, moveRight);
		onClose();
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
					<div className="NLT__header-menu-header">Move</div>
					{renderMoveItems()}
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
