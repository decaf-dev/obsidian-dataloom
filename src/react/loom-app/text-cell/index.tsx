import { useRenderMarkdown } from "src/shared/render-utils";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

import "./styles.css";

interface Props {
	value: string;
}

export default function TextCell({ value }: Props) {
	const { containerRef, renderRef } = useRenderMarkdown(value);

	return (
		<div className="dataloom-text-cell">
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
