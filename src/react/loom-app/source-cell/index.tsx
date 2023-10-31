import { Source, SourceType } from "src/shared/loom-state/types/loom-state";
import Bubble from "src/react/shared/bubble";
import Icon from "src/react/shared/icon";
import { getIconIdForSourceType } from "src/react/shared/icon/utils";
import { getSourceCellContent } from "src/shared/cell-content/source-cell-content";

interface Props {
	source: Source | null;
}

export default function SourceCell({ source }: Props) {
	const content = getSourceCellContent(source);

	return (
		<div className="dataloom-source-cell">
			<Bubble
				variant="no-fill"
				icon={
					<Icon
						lucideId={getIconIdForSourceType(
							source?.type as SourceType
						)}
					/>
				}
				value={content}
			/>
		</div>
	);
}
