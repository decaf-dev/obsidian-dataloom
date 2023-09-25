import { useRenderMarkdown } from "src/shared/render-utils";
import { getFileCellContent } from "src/shared/cell-content/file-cell-content";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";
import { useOverflow } from "src/shared/spacing/hooks";

import "./styles.css";

interface Props {
	shouldWrapOverflow: boolean;
	value: string;
}

export default function FileCell({ value, shouldWrapOverflow }: Props) {
	const content = getFileCellContent(value);
	const { containerRef, renderRef } = useRenderMarkdown(content);

	const overflowClassName = useOverflow(shouldWrapOverflow);

	let className = "dataloom-file-cell";
	className += " " + overflowClassName;

	return (
		<div className={className}>
			<div
				ref={(node) => {
					containerRef.current = node;
					appendOrReplaceFirstChild(node, renderRef.current);
				}}
			/>
		</div>
	);
}
