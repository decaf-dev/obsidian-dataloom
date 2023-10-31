import { useRenderMarkdown } from "src/shared/render-utils";
import { getFileCellContent } from "src/shared/cell-content/file-cell-content";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

import "./styles.css";

interface Props {
	value: string;
}

export default function FileCell({ value }: Props) {
	const content = getFileCellContent(value);
	const { containerRef, renderRef } = useRenderMarkdown(content);

	return (
		<div className="dataloom-file-cell">
			<div
				ref={(node) => {
					containerRef.current = node;
					appendOrReplaceFirstChild(node, renderRef.current);
				}}
			/>
		</div>
	);
}
