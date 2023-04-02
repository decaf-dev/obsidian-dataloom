import { useRenderMarkdown } from "src/services/hooks";
import "./styles.css";
interface Props {
	markdown: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
}

export default function TextCell({
	markdown,
	shouldWrapOverflow,
	useAutoWidth,
}: Props) {
	const { wrapperRef, contentRef, appendOrReplaceFirstChild } =
		useRenderMarkdown(markdown);

	let className = "NLT__text-cell";
	if (useAutoWidth) {
		className += " NLT__auto-width";
	} else {
		if (shouldWrapOverflow) {
			className += " NLT__wrap-overflow";
		} else {
			className += " NLT__hide-overflow";
		}
	}

	return (
		<div className={className}>
			<div
				ref={(node) => {
					wrapperRef.current = node;
					appendOrReplaceFirstChild(node, contentRef.current);
				}}
			></div>
		</div>
	);
}
