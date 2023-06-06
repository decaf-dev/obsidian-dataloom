import { css } from "@emotion/react";
import { getEmbedContent } from "src/shared/export/cell-content";
import { useRenderMarkdown } from "src/shared/render/hooks";
import { getSpacing } from "src/shared/spacing";
import { AspectRatio, PaddingSize } from "src/shared/types/types";
import { isURL } from "src/shared/validators";
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
	let externalLinkMarkdown = "";
	let isValidURL = false;
	if (markdown !== "") {
		if (isURL(markdown)) {
			isValidURL = true;
			externalLinkMarkdown = getEmbedContent(markdown);
		} else {
			externalLinkMarkdown = "Invalid URL";
		}
	}

	const { containerRef, markdownRef, appendOrReplaceFirstChild } =
		useRenderMarkdown(externalLinkMarkdown, false);
	return (
		<div
			className="NLT__embed-cell"
			css={css`
				width: 100%;
				height: 100%;
			`}
		>
			<div
				css={css`
					width: 100%;
					aspect-ratio: ${aspectRatio};
					padding-left: ${isValidURL
						? getSpacing(horizontalPadding)
						: "unset"};
					padding-right: ${isValidURL
						? getSpacing(horizontalPadding)
						: "unset"};
					padding-top: ${isValidURL
						? getSpacing(verticalPadding)
						: "unset"};
					padding-bottom: ${isValidURL
						? getSpacing(verticalPadding)
						: "unset"};

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
					appendOrReplaceFirstChild(node, markdownRef.current);
				}}
			/>
		</div>
	);
}
