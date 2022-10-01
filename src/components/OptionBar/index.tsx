import { useMemo } from "react";

import { SortDir } from "src/services/sort/types";
import { TableSettings, TableModel } from "src/services/table/types";
import Icon from "../Icon";
import { IconType } from "src/services/icon/types";

import "./styles.css";

interface SortBubbleProps {
	sortDir: SortDir;
	content: string;
}

const SortBubble = ({ sortDir, content }: SortBubbleProps) => {
	return (
		<div className="NLT__sort-bubble">
			{sortDir === SortDir.ASC ? (
				<Icon icon={IconType.ARROW_UPWARD} />
			) : (
				<Icon icon={IconType.ARROW_DOWNWARD} />
			)}
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
			.map((id) => {
				const cell = model.cells.find(
					(c) => c.columnId === id && c.isHeader
				);
				return cell;
			})
			.filter((c) => {
				const { sortDir } = settings.columns[c.columnId];
				return sortDir !== SortDir.NONE;
			})
			.map((c) => {
				const { sortDir } = settings.columns[c.columnId];
				return {
					content: c.html,
					sortDir,
				};
			});
	}, [model.cells, settings.columns]);

	return (
		<div className="NLT__option-bar">
			<SortBubbleList bubbles={bubbles} />
		</div>
	);
}
