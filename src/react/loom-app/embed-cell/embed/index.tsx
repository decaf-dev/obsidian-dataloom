import { useRenderMarkdown } from "src/shared/render-utils";
import { getSpacing } from "src/shared/spacing";
import {
	AspectRatio,
	PaddingSize,
} from "src/shared/loom-state/types/loom-state";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

import "./styles.css";

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
			style={{
				aspectRatio,
				paddingLeft: paddingX,
				paddingRight: paddingX,
				paddingTop: paddingY,
				paddingBottom: paddingY,
			}}
			ref={(node) => {
				containerRef.current = node;
				appendOrReplaceFirstChild(node, renderRef.current);
			}}
		/>
	);
}
