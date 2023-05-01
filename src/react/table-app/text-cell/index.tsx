import { useRenderMarkdown } from "src/shared/markdown/hooks";
import { useOverflowClassName } from "src/shared/spacing/hooks";
import "./styles.css";
interface Props {
	markdown: string;
	shouldWrapOverflow: boolean;
}

export default function TextCell({ markdown, shouldWrapOverflow }: Props) {
	const { containerRef, contentRef, appendOrReplaceFirstChild } =
		useRenderMarkdown(markdown, shouldWrapOverflow);

	const overflowClassName = useOverflowClassName(shouldWrapOverflow);
	const className = "NLT__text-cell" + " " + overflowClassName;
	return (
		<div className={className}>
			<div
				ref={(node) => {
					containerRef.current = node;
					appendOrReplaceFirstChild(node, contentRef.current);
				}}
			/>
		</div>
	);
}
