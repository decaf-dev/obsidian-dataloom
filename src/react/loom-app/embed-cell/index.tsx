import { getEmbedCellContent } from "src/shared/cell-content/embed-cell-content";
import {
	AspectRatio,
	PaddingSize,
} from "src/shared/loom-state/types/loom-state";

import Embed from "./embed";
import { useAppMount } from "../app-mount-provider";

import "./styles.css";

interface Props {
	isExternal: boolean;
	pathOrUrl: string;
	aspectRatio: AspectRatio;
	horizontalPadding: PaddingSize;
	verticalPadding: PaddingSize;
}

export default function EmbedCell({
	isExternal,
	pathOrUrl,
	aspectRatio,
	horizontalPadding,
	verticalPadding,
}: Props) {
	const { app } = useAppMount();
	const content = getEmbedCellContent(app, pathOrUrl, {
		isExternal,
	});
	return (
		<div className="dataloom-embed-cell">
			<Embed
				isExternalLink={isExternal}
				content={content}
				aspectRatio={aspectRatio}
				horizontalPadding={horizontalPadding}
				verticalPadding={verticalPadding}
			/>
		</div>
	);
}
