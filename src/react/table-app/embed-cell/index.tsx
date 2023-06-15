import { css } from "@emotion/react";
import { getEmbedCellContent } from "src/shared/cell-content/embed-cell-content";
import { useRenderMarkdown } from "src/obsidian-shim/development/render-utils";
import { getSpacing } from "src/shared/spacing";
import { AspectRatio, PaddingSize } from "src/shared/types";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

const EmbeddedLink = ({
	markdown,
	aspectRatio,
	horizontalPadding,
	verticalPadding,
}: Props) => {
	const { containerRef, renderRef } = useRenderMarkdown(markdown, true);

	const paddingX = getSpacing(horizontalPadding);
	const paddingY = getSpacing(verticalPadding);

	return (
		<div
			css={css`
				width: 100%;
				aspect-ratio: ${aspectRatio};
				padding-left: ${paddingX};
				padding-right: ${paddingX};
				padding-top: ${paddingY};
				padding-bottom: ${paddingY};

				iframe {
					width: 100%;
					height: 100%;
				}

				p {
					width: 100%;
					height: 100%;
					margin: 0px;
				}
			`}
			ref={(node) => {
				containerRef.current = node;
				appendOrReplaceFirstChild(node, renderRef.current);
			}}
		/>
	);
};

interface Props {
	markdown: string;
	aspectRatio: AspectRatio;
	horizontalPadding: PaddingSize;
	verticalPadding: PaddingSize;
}

export default function EmbedCell({
	markdown,
	aspectRatio,
	horizontalPadding,
	verticalPadding,
}: Props) {
	const content = getEmbedCellContent(markdown, true);
	return (
		<div
			className="NLT__embed-cell"
			css={css`
				width: 100%;
				height: 100%;
			`}
		>
			<EmbeddedLink
				markdown={content}
				aspectRatio={aspectRatio}
				horizontalPadding={horizontalPadding}
				verticalPadding={verticalPadding}
			/>
		</div>
	);
}
