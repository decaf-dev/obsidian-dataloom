import { Color } from "src/shared/loom-state/types";
import { useOverflow } from "src/shared/spacing/hooks";
import Tag from "../../shared/tag";

import "./styles.css";
interface Props {
	markdown: string;
	color: Color;
	shouldWrapOverflow: boolean;
}

export default function TagCell({
	markdown,
	color,
	shouldWrapOverflow,
}: Props) {
	const overflowStyle = useOverflow(shouldWrapOverflow);
	return (
		<div className="dataloom-tag-cell" css={overflowStyle}>
			<Tag markdown={markdown} color={color} />
		</div>
	);
}
