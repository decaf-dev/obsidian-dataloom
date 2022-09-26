import React from "react";

import Tag from "../Tag";

import "./styles.css";
interface Props {
	html: string;
	color: string;
}

export default function TagCell({ html, color }: Props) {
	return (
		<div className="NLT__tag-cell">
			<Tag html={html} color={color} />
		</div>
	);
}
