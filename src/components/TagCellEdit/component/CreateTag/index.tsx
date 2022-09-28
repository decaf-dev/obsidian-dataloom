import React from "react";

import Tag from "src/components/Tag";

import "./styles.css";

interface Props {
	isDarkMode: boolean;
	html: string;
	markdown: string;
	color: string;
	onAddTag: (markdown: string, html: string, color: string) => void;
}

export default function CreateTag({
	isDarkMode,
	markdown,
	html,
	color,
	onAddTag,
}: Props) {
	return (
		<div
			className="NLT__create-tag NLT__selectable"
			onClick={() => {
				onAddTag(markdown, html, color);
			}}
		>
			<div>Create&nbsp;</div>
			<Tag isDarkMode={isDarkMode} html={html} color={color} />
		</div>
	);
}
