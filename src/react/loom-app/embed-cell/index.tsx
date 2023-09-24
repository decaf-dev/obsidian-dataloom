import { getEmbedCellContent } from "src/shared/cell-content/embed-cell-content";
import {
	AspectRatio,
	PaddingSize,
} from "src/shared/loom-state/types/loom-state";

import Embed from "./embed";
import { useAppMount } from "../app-mount-provider";

import "./styles.css";

interface Props {
	isExternalLink: boolean;
	value: string;
	aspectRatio: AspectRatio;
	horizontalPadding: PaddingSize;
	verticalPadding: PaddingSize;
}

export default function EmbedCell({
	isExternalLink,
	value,
	aspectRatio,
	horizontalPadding,
	verticalPadding,
}: Props) {
	const { app } = useAppMount();
	const content = getEmbedCellContent(app, value, {
		isExternalLink,
	});
	return (
		<div className="dataloom-embed-cell">
			<Embed
				isExternalLink={isExternalLink}
				content={content}
				aspectRatio={aspectRatio}
				horizontalPadding={horizontalPadding}
				verticalPadding={verticalPadding}
			/>
		</div>
	);
}
