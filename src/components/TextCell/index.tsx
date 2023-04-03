import { useRenderMarkdown } from "src/services/markdown/hooks";
import { useOverflowClassname } from "src/services/spacing/hooks";
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
		useRenderMarkdown(markdown, useAutoWidth, shouldWrapOverflow);

	const overflowClassName = useOverflowClassname(
		useAutoWidth,
		shouldWrapOverflow
	);
	const className = "NLT__text-cell" + " " + overflowClass;
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
