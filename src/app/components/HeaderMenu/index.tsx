import React, { useEffect, useState } from "react";

import Menu from "../Menu";

import { SORT, PROPERTY_TYPE_ITEMS, SUBMENU } from "./constants";
import { ICON } from "../../constants";

import "./styles.css";
import HeaderMenuItem from "./components/HeaderMenuItem";
import IconButton from "../IconButton";
import Button from "../Button";

interface Props {
	isOpen: boolean;
	top: number;
	left: number;
	id: string;
	menuId: string;
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
	top,
	left,
	id,
	menuId,
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
	const [inputText, setInputText] = useState("");
	const [submenu, setSubmenu] = useState(null);

	useEffect(() => {
		setInputText(content);
	}, [content]);

	function renderPropertyTypeItems() {
		return PROPERTY_TYPE_ITEMS.map((item) => {
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
					icon={ICON.KEYBOARD_DOUBLE_ARROW_LEFT}
					iconText="Insert Left"
					onClick={() => handleInsertColumnClick(id, false)}
				/>
				<HeaderMenuItem
					icon={ICON.KEYBOARD_DOUBLE_ARROW_RIGHT}
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

	function renderEditItems() {
		return (
			<>
				<div>
					<input
						autoFocus
						type="text"
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
					/>
				</div>
				<Button onClick={() => handleDeleteClick(id)}>Delete</Button>
			</>
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
		onInsertColumnClick(id, insertRight);
		onClose();
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

	function renderMenu() {
		return Object.values(SUBMENU).map((item) => (
			<HeaderMenuItem
				key={item.name}
				iconText={item.content}
				icon={item.icon}
				onClick={() => setSubmenu(item)}
			/>
		));
	}

	function Submenu() {
		function renderSubmenuItems() {
			switch (submenu.name) {
				case SUBMENU.EDIT.name:
					return renderEditItems();
				case SUBMENU.INSERT.name:
					return renderInsertItems();
				case SUBMENU.SORT.name:
					return renderSortItems();
				case SUBMENU.MOVE.name:
					return renderMoveItems();
				case SUBMENU.PROPERTY_TYPE.name:
					return renderPropertyTypeItems();
				default:
					return <></>;
			}
		}
		return (
			<div>
				<div className="NLT__header-menu-header-container">
					<IconButton
						icon={ICON.KEYBOARD_BACKSPACE}
						onClick={() => setSubmenu(null)}
					/>
					<div className="NLT__header-menu-header">
						{submenu.content}
					</div>
				</div>
				{renderSubmenuItems()}
			</div>
		);
	}

	return (
		<Menu isOpen={isOpen} id={menuId} top={top} left={left}>
			<div className="NLT__header-menu">
				{submenu !== null ? <Submenu /> : renderMenu()}
			</div>
		</Menu>
	);
}
