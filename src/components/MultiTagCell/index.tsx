import React from "react";

import TagCell from "../TagCell";

export default function MultiTagCell({ tags = [] }) {
	return (
		<div className="NLT__multi-tag-cell">
			{tags.map((tag) => (
				<TagCell key={tag.id} content={tag.content} />
			))}
		</div>
	);
}
