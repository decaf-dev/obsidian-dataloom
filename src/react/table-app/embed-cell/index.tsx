import { css } from "@emotion/react";
import { getEmbedContent } from "src/shared/export/cell-content";
import { useRenderMarkdown } from "src/shared/render/hooks";
import { isURL } from "src/shared/validators";
interface Props {
	markdown: string;
}

export default function EmbedCell({ markdown }: Props) {
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
					aspect-ratio: ${isValidURL ? "16/9" : "unset"};

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
