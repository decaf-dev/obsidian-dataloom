import { useRenderMarkdown } from "src/services/markdown/hooks";
import { useOverflowClassname } from "src/services/spacing/hooks";
import "./styles.css";
interface Props {
	markdown: string;
	shouldWrapOverflow: boolean;
	hasAutoWidth: boolean;
}

export default function TextCell({
	markdown,
	shouldWrapOverflow,
	hasAutoWidth,
}: Props) {
	const { wrapperRef, contentRef, appendOrReplaceFirstChild } =
		useRenderMarkdown(markdown, hasAutoWidth, shouldWrapOverflow);

	const overflowClassName = useOverflowClassname(
		hasAutoWidth,
		shouldWrapOverflow
	);
	const className = "NLT__text-cell" + " " + overflowClassName;
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
