import Stack from "../../shared/stack";
import SortBubble from "./sort-button";
import ToggleColumn from "./toggle-column";
import Filter from "./filter/filter";
import Wrap from "../../shared/wrap";
import SearchBar from "./search-bar";
import ActiveFilterBubble from "./active-filter-bubble";
import { FilterType } from "src/shared/types";

import { SortDir, Column, HeaderCell, FilterRule } from "src/shared/types";
import {
	CellNotFoundError,
	ColumNotFoundError,
} from "src/shared/loom-state/loom-error";
import { isCellTypeFilterable } from "src/shared/loom-state/filter-by-rules";

import { ColumnWithMarkdown } from "./types";
import Padding from "src/react/shared/padding";
import { css } from "@emotion/react";
import Button from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import { useMountState } from "../mount-provider";
import ExportModal from "src/obsidian/export-modal";

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
		<Stack spacing="sm" isHorizontal>
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
	onRuleFilterTypeChange: (ruleId: string, value: FilterType) => void;
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
	const { tableFile } = useMountState();
	const sortedCells = headerCells.filter((cell) => {
		const columnId = cell.columnId;
		const column = columns.find((c) => c.id === columnId);
		if (!column) throw new ColumNotFoundError(columnId);
		return column.sortDir !== SortDir.NONE;
	});

	const activeRules = filterRules.filter((rule) => rule.isEnabled);

	const columnsWithMarkdown: ColumnWithMarkdown[] = columns.map((column) => {
		const headerCell = headerCells.find(
			(cell) => cell.columnId === column.id
		);
		if (!headerCell)
			throw new CellNotFoundError({
				columnId: column.id,
			});
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

	const { isMarkdownView } = useMountState();

	return (
		<div
			className="DataLoom__option-bar"
			css={css`
				width: 100%;
				border-bottom: 1px solid var(--background-modifier-border);
			`}
		>
			<Padding px={isMarkdownView ? "unset" : "lg"} py="md">
				<Stack spacing="lg" align="center" minHeight="40px">
					<Wrap
						justify={{ base: "space-between", mobile: "flex-end" }}
					>
						<Stack spacing="md" isHorizontal>
							<SortBubbleList
								headerCells={sortedCells}
								columns={columns}
								onRemoveClick={onSortRemoveClick}
							/>
							<ActiveFilterBubble
								numActive={activeRules.length}
							/>
						</Stack>
						<Stack spacing="sm" justify="flex-end" isHorizontal>
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
							<Button
								icon={<Icon lucideId="download" />}
								onClick={() => {
									new ExportModal(app, tableFile).open();
								}}
							></Button>
						</Stack>
					</Wrap>
				</Stack>
			</Padding>
		</div>
	);
}
