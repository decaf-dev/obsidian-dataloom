import React from "react";

import Tag from "../Tag";
import Stack from "../Stack";

import { Tag as TagType } from "../../services/table/types";

interface Props {
	tags: TagType[];
}
export default function MultiTagCell({ tags }: Props) {
	return (
		<div className="NLT__multi-tag-cell">
			<Stack spacing="10px" isVertical>
				{tags.map((tag: TagType) => (
					<Tag key={tag.id} html={tag.html} color={tag.color} />
				))}
			</Stack>
		</div>
	);
}
