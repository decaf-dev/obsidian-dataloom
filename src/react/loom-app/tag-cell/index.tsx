import { Color } from "src/shared/loom-state/types/loom-state";
import { useOverflow } from "src/shared/spacing/hooks";
import Tag from "../../shared/tag";

import "./styles.css";
interface Props {
	content: string;
	color: Color;
	shouldWrapOverflow: boolean;
}

export default function TagCell({ content, color, shouldWrapOverflow }: Props) {
	const overflowClassName = useOverflow(shouldWrapOverflow);
	let className = "dataloom-tag-cell";
	className += " " + overflowClassName;
	return (
		<div className={className}>
			<Tag content={content} color={color} />
		</div>
	);
}
