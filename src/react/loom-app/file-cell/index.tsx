import { useRenderMarkdown } from "src/shared/render-utils";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

import "./styles.css";

interface Props {
	content: string;
}

export default function FileCell({ content }: Props) {
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
