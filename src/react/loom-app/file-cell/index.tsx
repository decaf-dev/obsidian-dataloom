import { css } from "@emotion/react";
import { useRenderMarkdown } from "src/shared/render-utils";
import { getFileCellContent } from "src/shared/cell-content/file-cell-content";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";
import { useOverflow } from "src/shared/spacing/hooks";

interface Props {
	shouldWrapOverflow: boolean;
	markdown: string;
}

export default function FileCell({ markdown, shouldWrapOverflow }: Props) {
	const content = getFileCellContent(markdown);
	const { containerRef, renderRef } = useRenderMarkdown(content);

	const overflowStyle = useOverflow(shouldWrapOverflow);

	return (
		<div className="dataloom-file-cell" css={overflowStyle}>
			<div
				css={css`
					p {
						margin: 0;
						text-align: left;
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
