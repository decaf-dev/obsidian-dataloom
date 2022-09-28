import React from "react";

import Tag from "../Tag";

import "./styles.css";
interface Props {
	isDarkMode: boolean;
	html: string;
	color: string;
}

export default function TagCell({ isDarkMode, html, color }: Props) {
	return (
		<div className="NLT__tag-cell">
			<Tag isDarkMode={isDarkMode} html={html} color={color} />
		</div>
	);
}
