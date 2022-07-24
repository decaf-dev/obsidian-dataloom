import React, { useMemo } from "react";

import Button from "../Button";

import { SortDir } from "src/app/services/sort/types";

import "./styles.css";
import { findSortIcon } from "src/app/services/icon/utils";
import { Header } from "src/app/services/appData/state/header";

interface SortBubbleProps {
	sortDir: SortDir;
	content: string;
}

interface SortButtonListProps {
	bubbles: { sortDir: SortDir; content: string }[];
}

interface SortButtonProps {
	onButtonClick: () => void;
}

interface OptionBarProps {
	headers: Header[];
}

const SortBubble = ({ sortDir, content }: SortBubbleProps) => {
	const icon = findSortIcon(sortDir, "");
	return (
		<div className="NLT__sort-bubble">
			<span>{content}</span>
			{icon}
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

const SortButton = ({ onButtonClick }: SortButtonProps) => {
	return <Button onClick={onButtonClick}>Sort</Button>;
};

export default function OptionBar({ headers }: OptionBarProps) {
	const bubbles = useMemo(() => {
		return headers
			.filter((header) => header.sortDir !== SortDir.DEFAULT)
			.map((header) => {
				return {
					content: header.content,
					sortDir: header.sortDir,
				};
			});
	}, [headers]);

	console.log(bubbles);
	return (
		<div className="NLT__option-bar">
			<SortBubbleList bubbles={bubbles} />
			<SortButton onButtonClick={() => {}} />
		</div>
	);
}
