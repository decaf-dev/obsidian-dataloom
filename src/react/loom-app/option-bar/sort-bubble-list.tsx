import SortBubble from "./sort-bubble";
import Stack from "src/react/shared/stack";

import { Column } from "src/shared/loom-state/types/loom-state";

interface Props {
	sortedColumns: Column[];
	onRemoveClick: (columnId: string) => void;
}

export default function SortBubbleList({
	sortedColumns,
	onRemoveClick,
}: Props) {
	return (
		<Stack spacing="sm" isHorizontal>
			{sortedColumns.map((column, i) => {
				const { id, sortDir, content } = column;
				return (
					<SortBubble
						key={i}
						sortDir={sortDir}
						content={content}
						onRemoveClick={() => onRemoveClick(id)}
					/>
				);
			})}
		</Stack>
	);
}
