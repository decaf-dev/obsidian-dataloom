import React from "react";

import Tag from "../Tag";

import { Tag as TagType } from "../../services/table/types";

import "./styles.css";

interface Props {
	tags: TagType[];
}
export default function MultiTagCell({ tags }: Props) {
	return (
		<div className="NLT__multi-tag-cell">
			{tags.map((tag: TagType) => (
				<Tag key={tag.id} html={tag.html} color={tag.color} />
			))}
		</div>
	);
}
