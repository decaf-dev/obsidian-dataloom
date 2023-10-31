import { getSourceFileContent } from "src/shared/cell-content/source-file-content";
import { useRenderMarkdown } from "src/shared/render-utils";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";
import { useOverflow } from "src/shared/spacing/hooks";
import "./styles.css";

interface Props {
	content: string;
}

export default function SourceFileCell({ content: originalContent }: Props) {
	const content = getSourceFileContent(originalContent);
	const { containerRef, renderRef } = useRenderMarkdown(content);

	return (
		<div
			className="dataloom-source-file-cell"
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
