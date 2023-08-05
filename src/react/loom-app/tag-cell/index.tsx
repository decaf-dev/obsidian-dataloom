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
	const overflowClassName = useOverflow(shouldWrapOverflow);
	let className = "dataloom-tag-cell";
	className += " " + overflowClassName;
	return (
		<div className={className}>
			<Tag markdown={markdown} color={color} />
		</div>
	);
}
