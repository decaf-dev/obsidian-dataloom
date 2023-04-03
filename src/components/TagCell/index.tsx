import { useOverflowClassname } from "src/services/spacing/hooks";
import Tag from "../Tag";

import "./styles.css";
interface Props {
	isDarkMode: boolean;
	markdown: string;
	color: string;
	useAutoWidth: boolean;
	shouldWrapOverflow: boolean;
}

export default function TagCell({
	isDarkMode,
	markdown,
	color,
	useAutoWidth,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflowClassname(
		useAutoWidth,
		shouldWrapOverflow
	);
	const className = "NLT__tag-cell" + " " + overflowClass;
	return (
		<div className={className}>
			<Tag isDarkMode={isDarkMode} markdown={markdown} color={color} />
		</div>
	);
}
