import React from "react";

import TagCell from "../TagCell";

import { Tag } from "../../services/utils";
interface Props {
	tags: Tag[];
}
export default function MultiTagCell({ tags = [] }: Props) {
	return (
		<div className="NLT__multi-tag-cell">
			{tags.map((tag) => (
				<TagCell key={tag.id} id={tag.id} content={tag.content} />
			))}
		</div>
	);
}
