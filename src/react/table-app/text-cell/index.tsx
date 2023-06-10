import { useRenderMarkdown } from "src/obsidian-shim/development/render-utils";
import { useOverflow } from "src/shared/spacing/hooks";
import { css } from "@emotion/react";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

interface Props {
	markdown: string;
	shouldWrapOverflow: boolean;
}

export default function TextCell({ markdown, shouldWrapOverflow }: Props) {
	const { containerRef, renderRef } = useRenderMarkdown(markdown, false);

	const overflowStyle = useOverflow(shouldWrapOverflow);
	return (
		<div className="NLT__text-cell" css={overflowStyle}>
			<div
				css={css`
					p {
						margin: 0;
						text-align: left;
					}

					ul {
						padding: 0 var(--nlt-spacing--lg);
						margin: 0;
					}
				`}
				ref={(node) => {
					containerRef.current = node;
					appendOrReplaceFirstChild(node, renderRef.current);
				}}
			/>
		</div>
	);
}
