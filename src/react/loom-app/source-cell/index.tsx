import { useOverflow } from "src/shared/spacing/hooks";
import { Source, SourceType } from "src/shared/loom-state/types/loom-state";
import Bubble from "src/react/shared/bubble";
import Icon from "src/react/shared/icon";
import { getIconIdForSourceType } from "src/react/shared/icon/utils";
import { getSourceCellContent } from "src/shared/cell-content/source-cell-content";

interface Props {
	source: Source | null;
	shouldWrapOverflow: boolean;
}

export default function SourceCell({ source, shouldWrapOverflow }: Props) {
	const overflowClassName = useOverflow(shouldWrapOverflow);

	let className = "dataloom-source-cell";
	className += " " + overflowClassName;

	const content = getSourceCellContent(source);

	return (
		<div className={className}>
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
