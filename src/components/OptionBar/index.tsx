import { useMemo } from "react";

import { SortDir } from "src/services/sort/types";
import { TableSettings, TableModel } from "src/services/table/types";
import Icon from "../Icon";
import { IconType } from "src/services/icon/types";

import "./styles.css";
import { findColorClass } from "src/services/color";
import { useAppSelector } from "src/services/redux/hooks";
import Stack from "../Stack";
import Button from "src/components/Button";

interface SortBubbleProps {
	sortDir: SortDir;
	content: string;
	isDarkMode: boolean;
	onRemoveClick: () => void;
}

const SortBubble = ({
	isDarkMode,
	sortDir,
	content,
	onRemoveClick,
}: SortBubbleProps) => {
	const color = findColorClass(isDarkMode, "blue");
	let className = "NLT__sort-bubble " + color;
	return (
		<div className={className}>
			<Stack spacing="sm">
				{sortDir === SortDir.ASC ? (
					<Icon icon={IconType.ARROW_UPWARD} />
				) : (
					<Icon icon={IconType.ARROW_DOWNWARD} />
				)}
				<span>{content}</span>
				<Button
					icon={<Icon icon={IconType.CLOSE} />}
					onClick={onRemoveClick}
				/>
			</Stack>
		</div>
	);
};

interface SortButtonListProps {
	bubbles: { sortDir: SortDir; content: string; columnId: string }[];
	onRemoveClick: (columnId: string) => void;
}

const SortBubbleList = ({ bubbles, onRemoveClick }: SortButtonListProps) => {
	const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
	return (
		<Stack spacing="sm">
			{bubbles.map((bubble, i) => (
				<SortBubble
					isDarkMode={isDarkMode}
					key={i}
					sortDir={bubble.sortDir}
					content={bubble.content}
					onRemoveClick={() => onRemoveClick(bubble.columnId)}
				/>
			))}
		</Stack>
	);
};

interface Props {
	model: TableModel;
	settings: TableSettings;
	onSortRemoveClick: (columnId: string) => void;
}
export default function OptionBar({
	model,
	settings,
	onSortRemoveClick,
}: Props) {
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
					columnId: c.columnId,
					content: c.html,
					sortDir,
				};
			});
	}, [model.cells, settings.columns]);

	return (
		<div className="NLT__option-bar">
			<SortBubbleList
				bubbles={bubbles}
				onRemoveClick={onSortRemoveClick}
			/>
		</div>
	);
}
