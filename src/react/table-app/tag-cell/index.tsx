import { Color } from "src/shared/types";
import { useOverflowClassName } from "src/shared/spacing/hooks";
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
	const overflowClassName = useOverflowClassName(shouldWrapOverflow);
	const className = "NLT__tag-cell" + " " + overflowClassName;
	return (
		<div className={className}>
			<Tag markdown={markdown} color={color} />
		</div>
	);
}
