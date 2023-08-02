import { css } from "@emotion/react";
import { useRenderMarkdown } from "src/shared/render-utils";
import { getSpacing } from "src/shared/spacing";
import { AspectRatio, PaddingSize } from "src/shared/loom-state/types";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

interface Props {
	isExternalLink: boolean;
	content: string;
	aspectRatio: AspectRatio;
	horizontalPadding: PaddingSize;
	verticalPadding: PaddingSize;
}

export default function Embed({
	isExternalLink,
	content,
	aspectRatio,
	horizontalPadding,
	verticalPadding,
}: Props) {
	const { containerRef, renderRef } = useRenderMarkdown(content, {
		isEmbed: true,
		isExternalLink,
	});

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
}
