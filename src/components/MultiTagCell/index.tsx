import React from "react";

import { Tag as TagState } from "src/services/appData/state/types";
import Tag from "../Tag";
interface Props {
	tags: TagState[];
}
export default function MultiTagCell({ tags = [] }: Props) {
	return (
		<div className="NLT__multi-tag-cell">
			{tags.map((tag) => (
				<Tag key={tag.id} color={tag.color} content={tag.content} />
			))}
		</div>
	);
}
