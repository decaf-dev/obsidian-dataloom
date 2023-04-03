import { useMemo } from "react";

import { TableModel, SortDir } from "src/services/tableState/types";

import { useAppSelector } from "src/services/redux/hooks";
import Stack from "../Stack";

import { ColumnIdError } from "src/services/tableState/error";
import SearchBar from "./components/SearchBar";

import "./styles.css";
import SortBubble from "./components/SortBubble";

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
	model: TableModel;
	onSortRemoveClick: (columnId: string) => void;
}
export default function OptionBar({ model, onSortRemoveClick }: Props) {
	const bubbles = useMemo(() => {
		return model.cells
			.filter((c) => c.isHeader)
			.filter((c) => {
				const columnId = c.columnId;
				const column = model.columns.find((c) => c.id == columnId);
				if (!column) throw new ColumnIdError(columnId);
				return column.sortDir !== SortDir.NONE;
			})
			.map((c) => {
				const columnId = c.columnId;
				const column = model.columns.find((c) => c.id == columnId);
				if (!column) throw new ColumnIdError(columnId);
				return {
					columnId: c.columnId,
					markdown: c.markdown,
					sortDir: column.sortDir,
				};
			});
	}, [model]);

	return (
		<div className="NLT__option-bar">
			<SearchBar />
			<SortBubbleList
				bubbles={bubbles}
				onRemoveClick={onSortRemoveClick}
			/>
		</div>
	);
}
