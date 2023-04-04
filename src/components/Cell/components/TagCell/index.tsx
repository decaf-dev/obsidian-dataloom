import { Color } from "src/services/color/types";
import { useOverflowClassName } from "src/services/spacing/hooks";
import Tag from "../../../Tag";

import "./styles.css";
interface Props {
	isDarkMode: boolean;
	markdown: string;
	color: Color;
	hasAutoWidth: boolean;
	shouldWrapOverflow: boolean;
}

export default function TagCell({
	isDarkMode,
	markdown,
	color,
	hasAutoWidth,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflowClassName(
		hasAutoWidth,
		shouldWrapOverflow
	);
	const className = "NLT__tag-cell" + " " + overflowClassName;
	return (
		<div className={className}>
			<Tag isDarkMode={isDarkMode} markdown={markdown} color={color} />
		</div>
	);
}
