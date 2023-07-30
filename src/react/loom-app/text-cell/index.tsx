import { useRenderMarkdown } from "src/shared/render-utils";
import { useOverflow } from "src/shared/spacing/hooks";
import { css } from "@emotion/react";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

interface Props {
	markdown: string;
	shouldWrapOverflow: boolean;
}

export default function TextCell({ markdown, shouldWrapOverflow }: Props) {
	const { containerRef, renderRef } = useRenderMarkdown(markdown);

	const overflowStyle = useOverflow(shouldWrapOverflow);
	return (
		<div
			className="dataloom-text-cell"
			css={css`
				width: 100%;
				height: 100%;
				${overflowStyle}
			`}
		>
			<div
				css={css`
					text-align: left;

					p {
						margin: 0;
					}

					//.contains-task-list is from dataview
					//it is what is rendered for a task list
					ul:not(.contains-task-list) {
						padding-left: var(--nlt-spacing--xl);
						padding-right: 0;
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
