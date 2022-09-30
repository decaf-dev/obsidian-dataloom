import React, { useMemo } from "react";

import { SortDir } from "src/services/sort/types";
import { findSortIcon } from "src/services/icon/utils";
import { TableSettings, TableModel } from "src/services/table/types";

import "./styles.css";

interface SortBubbleProps {
	sortDir: SortDir;
	content: string;
}

const SortBubble = ({ sortDir, content }: SortBubbleProps) => {
	const icon = findSortIcon(sortDir, "NLT__icon--md");
	return (
		<div className="NLT__sort-bubble">
			{icon}
			<span>{content}</span>
		</div>
	);
};

interface SortButtonListProps {
	bubbles: { sortDir: SortDir; content: string }[];
}

const SortBubbleList = ({ bubbles }: SortButtonListProps) => {
	return (
		<>
			{bubbles.map((bubble, i) => (
				<SortBubble
					key={i}
					sortDir={bubble.sortDir}
					content={bubble.content}
				/>
			))}
		</>
	);
};

interface Props {
	model: TableModel;
	settings: TableSettings;
}
export default function OptionBar({ model, settings }: Props) {
	const bubbles = useMemo(() => {
		return model.columnIds
			.map((columnId) => {
				const cell = model.cells.find(
					(c) => c.columnId === columnId && c.isHeader
				);
				return cell;
			})
			.filter((cell) => {
				const { sortDir } = settings.columns[cell.columnId];
				return sortDir !== SortDir.NONE;
			})
			.map((cell, i) => {
				const { sortDir } = settings.columns[cell.columnId];
				return {
					content: cell.html,
					sortDir,
				};
			});
	}, [model]);

	return (
		<div className="NLT__option-bar">
			<SortBubbleList bubbles={bubbles} />
		</div>
	);
}
