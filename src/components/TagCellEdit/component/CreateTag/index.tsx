import React from "react";

import Tag from "src/components/Tag";

import "./styles.css";

interface Props {
	content: string;
	color: string;
	onAddTag: (value: string) => void;
}

export default function CreateTag({ content, color, onAddTag }: Props) {
	return (
		<div
			className="NLT__create-tag NLT__selectable"
			onClick={() => {
				onAddTag(content);
			}}
		>
			<div>Create&nbsp;</div>
			<Tag content={content} color={color} />
		</div>
	);
}
