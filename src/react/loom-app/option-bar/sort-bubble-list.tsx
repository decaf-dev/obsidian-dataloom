import SortBubble from "./sort-bubble";
import Stack from "src/react/shared/stack";

import ColumNotFoundError from "src/shared/error/column-not-found-error";
import { Column, HeaderCell } from "src/shared/loom-state/types/loom-state";

interface Props {
	headerCells: HeaderCell[];
	columns: Column[];
	onRemoveClick: (columnId: string) => void;
}

export default function SortBubbleList({
	headerCells,
	columns,
	onRemoveClick,
}: Props) {
	return (
		<Stack spacing="sm" isHorizontal>
			{headerCells.map((cell, i) => {
				const column = columns.find((c) => c.id === cell.columnId);
				if (!column) throw new ColumNotFoundError(cell.columnId);
				const { markdown, columnId } = cell;
				const { sortDir } = column;
				return (
					<SortBubble
						key={i}
						sortDir={sortDir}
						markdown={markdown}
						onRemoveClick={() => onRemoveClick(columnId)}
					/>
				);
			})}
		</Stack>
	);
}
