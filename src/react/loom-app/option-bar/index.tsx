import Stack from "../../shared/stack";
import SortBubble from "./sort-button";
import ToggleColumn from "./toggle-column";
import Filter from "./filter/filter";
import Wrap from "../../shared/wrap";
import SearchBar from "./search-bar";
import ActiveFilterBubble from "./active-filter-bubble";
import { FilterType } from "src/shared/loom-state/types";

import {
	SortDir,
	Column,
	HeaderCell,
	FilterRule,
} from "src/shared/loom-state/types";
import CellNotFoundError from "src/shared/error/cell-not-found-error";
import ColumNotFoundError from "src/shared/error/column-not-found-error";
import { isCellTypeFilterable } from "src/react/loom-app/app/filter-by-rules";

import { ColumnWithMarkdown } from "./types";
import Padding from "src/react/shared/padding";
import Icon from "src/react/shared/icon";
import { MenuLevel } from "src/shared/menu/types";
import { useMenu } from "src/shared/menu/hooks";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import MenuButton from "src/react/shared/menu-button";
import MoreMenu from "./more-menu";

import "./styles.css";

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
	numFrozenColumns: number;
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
	onFrozenColumnsChange: (value: number) => void;
}
export default function OptionBar({
	numFrozenColumns,
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
	onFrozenColumnsChange,
}: Props) {
	const sortedCells = headerCells.filter((cell) => {
		const columnId = cell.columnId;
		const column = columns.find((c) => c.id === columnId);
		if (!column) throw new ColumNotFoundError(columnId);
		return column.sortDir !== SortDir.NONE;
	});

	const { menu, isMenuOpen, menuRef, closeTopMenu } = useMenu(MenuLevel.ONE);
	const { triggerRef, triggerPosition } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		openDirection: "left",
	});

	function handleMenuCloseClick(shouldFocusTrigger: boolean) {
		closeTopMenu({ shouldFocusTrigger });
	}

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

	return (
		<>
			<div className="dataloom-option-bar">
				<Padding py="md">
					<Stack spacing="lg" align="center" minHeight="40px">
						<Wrap
							justify={{
								base: "space-between",
								mobile: "flex-end",
							}}
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
								<div ref={triggerRef}>
									<MenuButton
										menu={menu}
										icon={<Icon lucideId="more-vertical" />}
									/>
								</div>
							</Stack>
						</Wrap>
					</Stack>
				</Padding>
			</div>
			<MoreMenu
				id={menu.id}
				ref={menuRef}
				isOpen={isMenuOpen}
				top={triggerPosition.top}
				left={triggerPosition.left}
				numFrozenColumns={numFrozenColumns}
				onFrozenColumnsChange={onFrozenColumnsChange}
				onCloseClick={handleMenuCloseClick}
			/>
		</>
	);
}
