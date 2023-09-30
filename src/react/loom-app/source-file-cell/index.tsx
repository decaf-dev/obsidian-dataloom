import { getSourceFileContent } from "src/shared/cell-content/source-file-content";
import { useRenderMarkdown } from "src/shared/render-utils";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";
import { useOverflow } from "src/shared/spacing/hooks";
import "./styles.css";

interface Props {
	shouldWrapOverflow: boolean;
	content: string;
}

export default function SourceFileCell({
	shouldWrapOverflow,
	content: originalContent,
}: Props) {
	const content = getSourceFileContent(originalContent);
	const overflowClassName = useOverflow(shouldWrapOverflow);
	const { containerRef, renderRef } = useRenderMarkdown(content);

	let className = "dataloom-source-file-cell";
	className += " " + overflowClassName;
	return (
		<div
			className={className}
			ref={(node) => {
				if (content !== "") {
					containerRef.current = node;
					appendOrReplaceFirstChild(node, renderRef.current);
				}
			}}
		>
			{content === "" && content}
		</div>
	);
}
