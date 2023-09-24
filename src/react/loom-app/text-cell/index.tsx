import { useRenderMarkdown } from "src/shared/render-utils";
import { useOverflow } from "src/shared/spacing/hooks";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

import "./styles.css";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
}

export default function TextCell({ value, shouldWrapOverflow }: Props) {
	const { containerRef, renderRef } = useRenderMarkdown(value);
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
