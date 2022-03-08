import React from "react";

import "./styles.css";

export default function IconText({
	onClick = null,
	icon = null,
	iconText = "",
}) {
	return (
		<div className="NLT__icon-text NLT__selectable" onClick={onClick}>
			{icon}
			{iconText}
		</div>
	);
}
