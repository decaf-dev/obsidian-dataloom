import React, { useEffect, useState, useRef } from "react";

import Menu from "../Menu";

import { SORT, TYPE_ITEMS, SUBMENU } from "./constants";
import { ICON } from "../../constants";

import "./styles.css";
import HeaderMenuItem from "./components/HeaderMenuItem";
import IconButton from "../IconButton";
import Button from "../Button";
import Switch from "../Switch";
import { CONTENT_TYPE } from "src/app/constants";

interface Props {
	isOpen: boolean;
	top: number;
	left: number;
	id: string;
	menuId: string;
	index: number;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
	sortName: string;
	content: string;
	type: string;
	isFirstChild: boolean;
	isLastChild: boolean;
	onInsertColumnClick: (id: string, insertRight: boolean) => void;
	onMoveColumnClick: (id: string, moveRight: boolean) => void;
	onTypeSelect: (id: string, type: string) => void;
	onSortSelect: (id: string, type: string, sortName: string) => void;
	onDeleteClick: (id: string) => void;
	onOutsideClick: (id: string, inputText: string) => void;
	onAutoWidthToggle: (id: string, value: boolean) => void;
	onWrapOverflowToggle: (id: string, value: boolean) => void;
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
	useAutoWidth,
	shouldWrapOverflow,
	isFirstChild,
	isLastChild,
	onTypeSelect,
	onSortSelect,
	onDeleteClick,
	onOutsideClick,
	onInsertColumnClick,
	onMoveColumnClick,
	onClose,
	onWrapOverflowToggle,
	onAutoWidthToggle,
}: Props) {
	const [inputText, setInputText] = useState("");
	const [submenu, setSubmenu] = useState(null);
	const lastLength = useRef(0);

	useEffect(() => {
		if (!isOpen) {
			//If we're in Live Preview mode and we click on the header and then click on the outside of
			//the component, the header will close, set the data (which didn't change), which cause an update
			//which persists the data again. We can prevent this by only calling onOutsideClick
			//if the data has actually changed
			if (inputText.length !== lastLength.current) {
				lastLength.current = inputText.length;
				if (inputText !== content) {
					onOutsideClick(id, inputText);
				}
			}
			setSubmenu(null);
		}
	}, [isOpen, inputText.length, lastLength.current]);

	useEffect(() => {
		setInputText(content);
	}, [content]);

	function renderTypeItems() {
		return TYPE_ITEMS.map((item) => {
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
				{!isFirstChild && (
					<HeaderMenuItem
						icon={ICON.KEYBOARD_DOUBLE_ARROW_LEFT}
						iconText="Move Left"
						onClick={() => handleMoveColumnClick(id, false)}
					/>
				)}
				{!isLastChild && (
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
				<div style={{ marginBottom: "10px" }}>
					<p className="NLT__label">Header Name</p>
					<input
						className="NLT__input NLT__header-menu-input"
						autoFocus
						type="text"
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
					/>
				</div>
				{(type === CONTENT_TYPE.TEXT ||
					type === CONTENT_TYPE.NUMBER) && (
					<div>
						<p className="NLT__label">Auto Width</p>
						<Switch
							isChecked={useAutoWidth}
							onToggle={(value) => onAutoWidthToggle(id, value)}
						/>
						{!useAutoWidth && (
							<>
								<p className="NLT__label">Wrap Overflow</p>
								<Switch
									isChecked={shouldWrapOverflow}
									onToggle={(value) =>
										onWrapOverflowToggle(id, value)
									}
								/>
							</>
						)}
					</div>
				)}
				<Button
					style={{ marginTop: "5px" }}
					onClick={() => handleDeleteClick(id)}
				>
					Delete
				</Button>
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

	function handleDeleteClick(id: string) {
		if (window.confirm("Are you sure you want to delete this column?")) {
			onDeleteClick(id);
			onClose();
		}
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
				case SUBMENU.TYPE.name:
					return renderTypeItems();
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
