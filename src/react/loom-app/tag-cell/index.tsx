import Tag from "../../shared/tag";

import { Color } from "src/shared/loom-state/types/loom-state";

import "./styles.css";

interface Props {
	content: string;
	color: Color;
}

export default function TagCell({ content, color }: Props) {
	return (
		<div className="dataloom-tag-cell">
			<Tag content={content} color={color} />
		</div>
	);
}
