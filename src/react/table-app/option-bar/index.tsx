import { useMemo } from "react";

import {
	SortDir,
	Column,
	HeaderCell,
	FilterRule,
	CellType,
	Tag,
} from "src/data/types";

import Stack from "../../shared/stack";

import { CellNotFoundError, ColumnIdError } from "src/shared/table-state/error";
import SearchBar from "./search-bar";
import SortBubble from "./sort-button";

import Flex from "../../shared/flex";
import ToggleColumn from "./toggle-column";
import Filter from "./filter/filter";

import "./styles.css";

interface SortButtonListProps {
	bubbles: { sortDir: SortDir; markdown: string; columnId: string }[];
	onRemoveClick: (columnId: string) => void;
}

const SortBubbleList = ({ bubbles, onRemoveClick }: SortButtonListProps) => {
	return (
		<Stack spacing="sm">
			{bubbles.map((bubble, i) => (
				<SortBubble
					key={i}
					sortDir={bubble.sortDir}
					markdown={bubble.markdown}
					onRemoveClick={() => onRemoveClick(bubble.columnId)}
				/>
			))}
		</Stack>
	);
};

interface Props {
	headerCells: HeaderCell[];
	columns: Column[];
	filterRules: FilterRule[];
	tags: Tag[];
	onSortRemoveClick: (columnId: string) => void;
	onColumnToggle: (columnId: string) => void;
	onRuleToggle: (ruleId: string) => void;
	onRuleColumnChange: (ruleId: string, columnId: string) => void;
	onRuleFilterTypeChange: (ruleId: string, value: string) => void;
	onRuleTextChange: (ruleId: string, value: string) => void;
	onRuleDeleteClick: (ruleId: string) => void;
	onRuleAddClick: (columnId: string) => void;
}
export default function OptionBar({
	headerCells,
	filterRules,
	columns,
	tags,
	onSortRemoveClick,
	onColumnToggle,
	onRuleToggle,
	onRuleColumnChange,
	onRuleFilterTypeChange,
	onRuleTextChange,
	onRuleDeleteClick,
	onRuleAddClick,
}: Props) {
	const bubbles = useMemo(() => {
		return headerCells
			.filter((cell) => {
				const columnId = cell.columnId;
				const column = columns.find((c) => c.id == columnId);
				if (!column) throw new ColumnIdError(columnId);
				return column.sortDir !== SortDir.NONE;
			})
			.map((cell) => {
				const columnId = cell.columnId;
				const column = columns.find((c) => c.id == columnId);
				if (!column) throw new ColumnIdError(columnId);
				return {
					columnId: cell.columnId,
					markdown: cell.markdown,
					sortDir: column.sortDir,
				};
			});
	}, [headerCells, columns]);

	const togglableColumns = useMemo(() => {
		return columns.map((column) => {
			const cell = headerCells.find((cell) => cell.columnId == column.id);
			if (!cell) throw new CellNotFoundError();
			return {
				id: column.id,
				name: cell.markdown,
				isVisible: column.isVisible,
			};
		});
	}, [headerCells, columns]);

	const filterableColumns = useMemo(() => {
		return columns
			.filter((column) => {
				const { type } = column;
				if (
					type === CellType.TEXT ||
					type == CellType.CHECKBOX ||
					type == CellType.TAG ||
					type == CellType.MULTI_TAG
				)
					return true;
				return false;
			})
			.map((column) => {
				const cell = headerCells.find(
					(cell) => cell.columnId == column.id
				);
				if (!cell) throw new CellNotFoundError();
				return {
					id: column.id,
					name: cell.markdown,
					cellType: column.type,
				};
			});
	}, [headerCells, columns]);

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
						<Filter
							columns={filterableColumns}
							tags={tags}
							filterRules={filterRules}
							onAddClick={onRuleAddClick}
							onToggle={onRuleToggle}
							onColumnChange={onRuleColumnChange}
							onFilterTypeChange={onRuleFilterTypeChange}
							onTextChange={onRuleTextChange}
							onDeleteClick={onRuleDeleteClick}
						/>
						<ToggleColumn
							columns={togglableColumns}
							onToggle={onColumnToggle}
						/>
					</Stack>
				</Flex>
			</Stack>
		</div>
	);
}
