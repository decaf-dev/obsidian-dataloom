import React, { useEffect, useState } from "react";

import Menu from "../Menu";

export default function HeaderMenu({
	id = 0,
	content = "",
	style = {},
	hide = false,
	onOutsideClick = null,
}) {
	const [text, setText] = useState("");

	useEffect(() => {
		setText(content);
	}, [content]);

	return (
		<Menu
			hide={hide}
			style={style}
			content={
				<div className="NLT__menu-container">
					<input
						autoFocus
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<div className="NLT__menu-header">Property Type</div>
					<p className="NLT__menu-item">Text</p>
					<p className="NLT__menu-item">Number</p>
					<p className="NLT__menu-item">Tag</p>
					<p className="NLT__menu-item">Multi-Tag</p>
				</div>
			}
			onOutsideClick={() => onOutsideClick(id, text)}
		/>
	);
}
