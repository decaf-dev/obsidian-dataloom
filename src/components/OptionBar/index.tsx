import React, { useMemo } from "react";

import { SortDir } from "src/services/sort/types";

import "./styles.css";
import { findSortIcon } from "src/services/icon/utils";
import { Header } from "src/services/state/types";

interface SortBubbleProps {
	sortDir: SortDir;
	content: string;
}

interface SortButtonListProps {
	bubbles: { sortDir: SortDir; content: string }[];
}

interface OptionBarProps {
	headers: Header[];
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

export default function OptionBar({ headers }: OptionBarProps) {
	const bubbles = useMemo(() => {
		return headers
			.filter((header) => header.sortDir !== SortDir.NONE)
			.map((header) => {
				return {
					content: header.content,
					sortDir: header.sortDir,
				};
			});
	}, [headers]);

	return (
		<div className="NLT__option-bar">
			<SortBubbleList bubbles={bubbles} />
		</div>
	);
}
