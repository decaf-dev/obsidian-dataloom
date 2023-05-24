import Stack from "../../shared/stack";
import SortBubble from "./sort-button";
import Flex from "../../shared/flex";
import ToggleColumn from "./toggle-column";
import Filter from "./filter/filter";
import SearchBar from "./search-bar";
import Divider from "src/react/shared/divider";
import ActiveFilterBubble from "./active-filter-bubble";

import {
	SortDir,
	Column,
	HeaderCell,
	FilterRule,
} from "src/shared/types/types";
import {
	CellNotFoundError,
	ColumNotFoundError,
} from "src/shared/table-state/table-error";
import { isCellTypeFilterable } from "src/shared/table-state/filter-by-rules";

import "./styles.css";
import { ColumnWithMarkdown } from "./types";

interface SortButtonListProps {
	headerCells: HeaderCell[];
	columns: Column[];
	onRemoveClick: (columnId: string) => void;
}

const SortBubbleList = ({
	headerCells,
	columns,
	onRemoveClick,
}: SortButtonListProps) => {
	return (
		<Stack spacing="sm">
			{headerCells.map((cell, i) => {
				const column = columns.find((c) => c.id === cell.columnId);
				if (!column) throw new ColumNotFoundError(cell.columnId);
				const { markdown, columnId } = cell;
				const { sortDir } = column;
				return (
					<SortBubble
						key={i}
						sortDir={sortDir}
						markdown={markdown}
						onRemoveClick={() => onRemoveClick(columnId)}
					/>
				);
			})}
		</Stack>
	);
};

interface Props {
	headerCells: HeaderCell[];
	columns: Column[];
	filterRules: FilterRule[];
	onSortRemoveClick: (columnId: string) => void;
	onColumnToggle: (columnId: string) => void;
	onRuleToggle: (ruleId: string) => void;
	onRuleColumnChange: (ruleId: string, columnId: string) => void;
	onRuleFilterTypeChange: (ruleId: string, value: string) => void;
	onRuleTextChange: (ruleId: string, value: string) => void;
	onRuleDeleteClick: (ruleId: string) => void;
	onRuleAddClick: (columnId: string) => void;
	onRuleTagsChange: (ruleId: string, value: string[]) => void;
}
export default function OptionBar({
	headerCells,
	columns,
	filterRules,
	onSortRemoveClick,
	onColumnToggle,
	onRuleToggle,
	onRuleColumnChange,
	onRuleFilterTypeChange,
	onRuleTextChange,
	onRuleDeleteClick,
	onRuleAddClick,
	onRuleTagsChange,
}: Props) {
	const sortedCells = headerCells.filter((cell) => {
		const columnId = cell.columnId;
		const column = columns.find((c) => c.id == columnId);
		if (!column) throw new ColumNotFoundError(columnId);
		return column.sortDir !== SortDir.NONE;
	});

	const activeRules = filterRules.filter((rule) => rule.isEnabled);

	const columnsWithMarkdown: ColumnWithMarkdown[] = columns.map((column) => {
		const headerCell = headerCells.find(
			(cell) => cell.columnId === column.id
		);
		if (!headerCell) throw new CellNotFoundError();
		return {
			...column,
			markdown: headerCell.markdown,
		};
	});

	const filterableColumns: ColumnWithMarkdown[] = columnsWithMarkdown.filter(
		(column) => {
			const { type } = column;
			return isCellTypeFilterable(type);
		}
	);

	return (
		<div className="NLT__option-bar">
			<Stack spacing="lg" isVertical>
				<Flex justify="space-between" align="flex-end">
					<Stack spacing="md">
						<SortBubbleList
							headerCells={sortedCells}
							columns={columns}
							onRemoveClick={onSortRemoveClick}
						/>
						{activeRules.length !== 0 &&
							headerCells.length !== 0 && (
								<Divider isVertical height="1.5rem" />
							)}
						<ActiveFilterBubble numActive={activeRules.length} />
					</Stack>
					<Stack spacing="sm" justify="flex-end">
						<SearchBar />
						<Filter
							columns={filterableColumns}
							filterRules={filterRules}
							onAddClick={onRuleAddClick}
							onToggle={onRuleToggle}
							onColumnChange={onRuleColumnChange}
							onFilterTypeChange={onRuleFilterTypeChange}
							onTextChange={onRuleTextChange}
							onDeleteClick={onRuleDeleteClick}
							onTagsChange={onRuleTagsChange}
						/>
						<ToggleColumn
							columns={columnsWithMarkdown}
							onToggle={onColumnToggle}
						/>
					</Stack>
				</Flex>
			</Stack>
		</div>
	);
}
