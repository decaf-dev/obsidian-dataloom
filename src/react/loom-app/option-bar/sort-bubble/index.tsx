import Icon from "src/react/shared/icon";
import Bubble from "src/react/shared/bubble";

import { SortDir } from "src/shared/loom-state/types/loom-state";

interface SortBubbleProps {
	sortDir: SortDir;
	content: string;
	onRemoveClick: () => void;
}

export default function SortBubble({
	sortDir,
	content,
	onRemoveClick,
}: SortBubbleProps) {
	return (
		<div className="dataloom-sort-bubble">
			<Bubble
				canRemove
				value={content}
				icon={
					sortDir === SortDir.ASC ? (
						<Icon lucideId="arrow-up" />
					) : (
						<Icon lucideId="arrow-down" />
					)
				}
				onRemoveClick={onRemoveClick}
			/>
		</div>
	);
}
