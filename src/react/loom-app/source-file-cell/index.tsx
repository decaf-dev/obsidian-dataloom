import { useRenderMarkdown } from "src/shared/render-utils";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";
import { useOverflow } from "src/shared/spacing/hooks";

interface Props {
	shouldWrapOverflow: boolean;
	value: string;
}

export default function SourceFileCell({ shouldWrapOverflow, value }: Props) {
	const overflowClassName = useOverflow(shouldWrapOverflow);
	const { containerRef, renderRef } = useRenderMarkdown(value);

	let className = "dataloom-source-file-cell";
	className += " " + overflowClassName;
	return (
		<div
			ref={(node) => {
				if (value !== "") {
					containerRef.current = node;
					appendOrReplaceFirstChild(node, renderRef.current);
				}
			}}
		>
			{value === "" && "None"}
		</div>
	);
}
