import { useRenderMarkdown } from "src/services/markdown/hooks";
import { useOverflowClassName } from "src/services/spacing/hooks";
import "./styles.css";
interface Props {
	markdown: string;
	shouldWrapOverflow: boolean;
}

export default function TextCell({ markdown, shouldWrapOverflow }: Props) {
	const { wrapperRef, contentRef, appendOrReplaceFirstChild } =
		useRenderMarkdown(markdown, shouldWrapOverflow);

	const overflowClassName = useOverflowClassName(shouldWrapOverflow);
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
