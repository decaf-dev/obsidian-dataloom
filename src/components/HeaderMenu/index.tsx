import React, { useEffect, useState } from "react";

import Menu from "../Menu";

import "./styles.css";

import { MENU_ACTION, MENU_ITEMS } from "./constants";

export default function HeaderMenu({
	hide = false,
	style = {},
	id = 0,
	position = 0,
	content = "",
	type = "",
	onItemClick = null,
	onDeleteClick = null,
	onOutsideClick = null,
	onClose = null,
}) {
	const [text, setText] = useState("");

	useEffect(() => {
		setText(content);
	}, [content]);

	function renderMenuItems() {
		return MENU_ITEMS.map((item) => {
			let className = "NLT__header-menu-item";
			if (item.type === type) className += " NLT__selected";
			return (
				<p
					key={item.name}
					className={className}
					onClick={() =>
						handleClick(
							MENU_ACTION.ITEM_CLICK,
							id,
							position,
							item.type
						)
					}
				>
					{item.content}
				</p>
			);
		});
	}

	function handleClick(action, ...props) {
		switch (action) {
			case MENU_ACTION.ITEM_CLICK:
				onItemClick(...props);
				break;
			case MENU_ACTION.DELETE:
				onDeleteClick(...props);
				break;
			case MENU_ACTION.OUTSIDE_CLICK:
				onOutsideClick(...props);
				break;
			default:
				break;
		}
		onClose();
	}

	return (
		<Menu
			hide={hide}
			style={style}
			content={
				<div className="NLT__header-menu-container">
					<input
						autoFocus
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<div className="NLT__header-menu-header">Property Type</div>
					{renderMenuItems(id)}
					<button
						className="NLT__button"
						onClick={() =>
							handleClick(MENU_ACTION.DELETE, id, position)
						}
					>
						Delete
					</button>
				</div>
			}
			onOutsideClick={() =>
				handleClick(MENU_ACTION.OUTSIDE_CLICK, id, text)
			}
		/>
	);
}
