import { useMemo } from "react";

import { SortDir, Cell, Column } from "src/services/tableState/types";

import { useAppSelector } from "src/services/redux/hooks";
import Stack from "../Stack";

import {
	CellNotFoundError,
	ColumnIdError,
} from "src/services/tableState/error";
import SearchBar from "./components/SearchBar";
import SortBubble from "./components/SortBubble";

import "./styles.css";
import Flex from "../Flex";
import ToggleColumn from "./components/ToggleColumn";

interface SortButtonListProps {
	bubbles: { sortDir: SortDir; markdown: string; columnId: string }[];
	onRemoveClick: (columnId: string) => void;
}

const SortBubbleList = ({ bubbles, onRemoveClick }: SortButtonListProps) => {
	const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
	return (
		<Stack spacing="sm">
			{bubbles.map((bubble, i) => (
				<SortBubble
					key={i}
					isDarkMode={isDarkMode}
					sortDir={bubble.sortDir}
					markdown={bubble.markdown}
					onRemoveClick={() => onRemoveClick(bubble.columnId)}
				/>
			))}
		</Stack>
	);
};

interface Props {
	cells: Cell[];
	columns: Column[];
	onSortRemoveClick: (columnId: string) => void;
	onColumnToggle: (columnId: string) => void;
}
export default function OptionBar({
	cells,
	columns,
	onSortRemoveClick,
	onColumnToggle,
}: Props) {
	const bubbles = useMemo(() => {
		return cells
			.filter((c) => c.isHeader)
			.filter((c) => {
				const columnId = c.columnId;
				const column = columns.find((c) => c.id == columnId);
				if (!column) throw new ColumnIdError(columnId);
				return column.sortDir !== SortDir.NONE;
			})
			.map((c) => {
				const columnId = c.columnId;
				const column = columns.find((c) => c.id == columnId);
				if (!column) throw new ColumnIdError(columnId);
				return {
					columnId: c.columnId,
					markdown: c.markdown,
					sortDir: column.sortDir,
				};
			});
	}, [cells, columns]);

	const toggleColumns = useMemo(() => {
		return columns.map((column) => {
			const headerCell = cells.find(
				(cell) => cell.isHeader && cell.columnId == column.id
			);
			if (!headerCell) throw new CellNotFoundError();
			return {
				id: column.id,
				name: headerCell.markdown,
				isVisible: column.isVisible,
			};
		});
	}, [cells, columns]);

	return (
		<div className="NLT__option-bar">
			<Stack spacing="lg" isVertical>
				<Flex justify="space-between" align="flex-end">
					<SortBubbleList
						bubbles={bubbles}
						onRemoveClick={onSortRemoveClick}
					/>
					<Stack spacing="sm" justify="flex-end">
						<SearchBar />
						<ToggleColumn
							columns={toggleColumns}
							onToggle={onColumnToggle}
						/>
					</Stack>
				</Flex>
			</Stack>
		</div>
	);
}
