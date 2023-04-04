import { useOverflowClassname } from "src/services/spacing/hooks";
import Tag from "../../../Tag";

import "./styles.css";
interface Props {
	isDarkMode: boolean;
	markdown: string;
	color: string;
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
	const overflowClassName = useOverflowClassname(
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
