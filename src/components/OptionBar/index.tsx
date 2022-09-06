import React, { useMemo } from "react";

import { SortDir } from "src/services/sort/types";

import "./styles.css";
import { findSortIcon } from "src/services/icon/utils";
import { TableSettings, Header } from "src/services/table/types";

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
	headers: Header[];
	tableSettings: TableSettings;
}
export default function OptionBar({ headers, tableSettings }: Props) {
	const bubbles = useMemo(() => {
		return headers
			.filter((_header, i) => {
				const settings = tableSettings.columns[i];
				return settings.sortDir !== SortDir.NONE;
			})
			.map((header, i) => {
				const settings = tableSettings.columns[i];
				return {
					content: header.content,
					sortDir: settings.sortDir,
				};
			});
	}, [headers]);

	return (
		<div className="NLT__option-bar">
			<SortBubbleList bubbles={bubbles} />
		</div>
	);
}
