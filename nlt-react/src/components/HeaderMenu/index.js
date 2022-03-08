import React, { useEffect, useState } from "react";

import Menu from "../Menu";

import "./styles.css";

import { CELL_TYPE } from "../../constants";

export default function HeaderMenu({
	hide = false,
	style = {},
	id = 0,
	position = 0,
	content = "",
	type = "",
	onItemClick = null,
	onOutsideClick = null,
}) {
	const [text, setText] = useState("");

	useEffect(() => {
		setText(content);
	}, [content]);

	function renderMenuItems() {
		const items = [
			{ name: "text", content: "Text", type: CELL_TYPE.TEXT },
			{ name: "number", content: "Number", type: CELL_TYPE.NUMBER },
			{ name: "tag", content: "Tag", type: CELL_TYPE.TAG },
			{
				name: "multi-tag",
				content: "Multi-Tag",
				type: CELL_TYPE.MULTI_TAG,
			},
		];
		return items.map((item) => {
			let className = "NLT__header-menu-item";
			if (item.type === type) className += " NLT__selected";
			return (
				<p
					key={item.name}
					className={className}
					onClick={() => onItemClick(id, position, item.type)}
				>
					{item.content}
				</p>
			);
		});
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
				</div>
			}
			onOutsideClick={() => onOutsideClick(id, text)}
		/>
	);
}
