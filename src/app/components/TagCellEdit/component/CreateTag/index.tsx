import React from "react";
import TagCell from "src/app/components/TagCell";

import "./styles.css";

interface Props {
	content: string;
	color: string;
	onAddTag: (value: string) => void;
}

export default function CreateTag({ content, color, onAddTag }: Props) {
	return (
		<div className="NLT__create-tag NLT__selectable">
			<div>Create&nbsp;</div>
			<TagCell
				content={content}
				color={color}
				hideLink={true}
				onClick={() => onAddTag(content)}
			/>
		</div>
	);
}
