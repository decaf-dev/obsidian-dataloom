import React, { useMemo } from "react";

import { SortDir } from "src/services/sort/types";
import { findSortIcon } from "src/services/icon/utils";
import { TableSettings, Cell } from "src/services/table/types";

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
	headers: Cell[];
	settings: TableSettings;
}
export default function OptionBar({ headers, settings }: Props) {
	const bubbles = useMemo(() => {
		return headers
			.filter((header) => {
				const { sortDir } = settings.columns[header.columnId];
				return sortDir !== SortDir.NONE;
			})
			.map((header, i) => {
				const { sortDir } = settings.columns[i];
				return {
					content: header.html,
					sortDir,
				};
			});
	}, [headers]);

	return (
		<div className="NLT__option-bar">
			<SortBubbleList bubbles={bubbles} />
		</div>
	);
}
