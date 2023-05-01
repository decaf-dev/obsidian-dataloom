import { Color } from "src/shared/types";
import { useOverflowClassName } from "src/services/spacing/hooks";
import Tag from "../../../shared/Tag";

import "./styles.css";
interface Props {
	isDarkMode: boolean;
	markdown: string;
	color: Color;
	shouldWrapOverflow: boolean;
}

export default function TagCell({
	isDarkMode,
	markdown,
	color,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflowClassName(shouldWrapOverflow);
	const className = "NLT__tag-cell" + " " + overflowClassName;
	return (
		<div className={className}>
			<Tag isDarkMode={isDarkMode} markdown={markdown} color={color} />
		</div>
	);
}
