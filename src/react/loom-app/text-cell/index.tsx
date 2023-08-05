import { useRenderMarkdown } from "src/shared/render-utils";
import { useOverflow } from "src/shared/spacing/hooks";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

interface Props {
	markdown: string;
	shouldWrapOverflow: boolean;
}

export default function TextCell({ markdown, shouldWrapOverflow }: Props) {
	const { containerRef, renderRef } = useRenderMarkdown(markdown);
	const overflowClassName = useOverflow(shouldWrapOverflow);

	let className = "dataloom-text-cell";
	className += " " + overflowClassName;
	return (
		<div className={className}>
			<div
				className="dataloom-text-cell__container"
				ref={(node) => {
					containerRef.current = node;
					appendOrReplaceFirstChild(node, renderRef.current);
				}}
			/>
		</div>
	);
}
