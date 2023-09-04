import Stack from "../../shared/stack";
import SearchBar from "./search-bar";
import ActiveFilterBubble from "./active-filter-bubble";
import Padding from "src/react/shared/padding";
import Icon from "src/react/shared/icon";
import MenuButton from "src/react/shared/menu-button";
import MoreMenu from "./more-menu";
import ToggleColumnMenu from "./toggle-column-menu";
import FilterMenu from "./filter/filter-menu";
import SortBubbleList from "./sort-bubble-list";

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
import { isSmallScreenSize } from "src/shared/render/utils";
import { useMenu } from "../../shared/menu/hooks";

import "./styles.css";

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

	const {
		menu: moreMenu,
		triggerRef: moreMenuTriggerRef,
		triggerPosition: moreMenuTriggerPosition,
		isOpen: isMoreMenuOpen,
		onOpen: onMoreMenuOpen,
		onRequestClose: onMoreMenuRequestClose,
		onClose: onMoreMenuClose,
	} = useMenu();

	const {
		menu: toggleMenu,
		triggerRef: toggleMenuTriggerRef,
		triggerPosition: toggleMenuTriggerPosition,
		isOpen: isToggleMenuOpen,
		onOpen: onToggleMenuOpen,
		onRequestClose: onToggleMenuRequestClose,
		onClose: onToggleMenuClose,
	} = useMenu();

	const {
		menu: filterMenu,
		triggerRef: filterMenuTriggerRef,
		triggerPosition: filterMenuTriggerPosition,
		isOpen: isFilterMenuOpen,
		onOpen: onFilterMenuOpen,
		onRequestClose: onFilterMenuRequestClose,
		onClose: onFilterMenuClose,
	} = useMenu();

	//TODO re-enable
	// const previousLength = usePrevious(filterRules.length);
	// React.useEffect(() => {
	// 	if (previousLength !== undefined) {
	// 		if (previousLength < filterRules.length) {
	// 			if (filterMenuRef.current) {
	// 				//Scroll to the bottom if we're adding a new rule
	// 				filterMenuRef.current.scrollTop =
	// 					filterMenuRef.current.scrollHeight;
	// 			}
	// 		}
	// 	}
	// }, [previousLength, filterRules.length, filterMenuRef]);

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

	const isSmallScreen = isSmallScreenSize();
	return (
		<>
			<div className="dataloom-option-bar">
				<Padding py="lg">
					<Stack
						isHorizontal={!isSmallScreen}
						spacing="sm"
						{...(!isSmallScreen && { justify: "space-between" })}
					>
						<Stack
							isHorizontal
							spacing="md"
							overflow="auto"
							{...(isSmallScreen && {
								width: "100%",
								justify: "flex-end",
							})}
						>
							<SortBubbleList
								headerCells={sortedCells}
								columns={columns}
								onRemoveClick={onSortRemoveClick}
							/>
							<ActiveFilterBubble
								numActive={activeRules.length}
							/>
						</Stack>
						<Stack
							isHorizontal
							spacing="sm"
							justify="flex-end"
							{...(isSmallScreen && {
								height: "40px",
								width: "100%",
							})}
						>
							<SearchBar />
							{isSmallScreen === false && (
								<MenuButton
									ref={filterMenuTriggerRef}
									menu={filterMenu}
									onOpen={onFilterMenuOpen}
								>
									Filter
								</MenuButton>
							)}
							{isSmallScreen === false && (
								<MenuButton
									ref={toggleMenuTriggerRef}
									menu={toggleMenu}
									onOpen={onToggleMenuOpen}
								>
									Toggle
								</MenuButton>
							)}
							<MenuButton
								ref={moreMenuTriggerRef}
								menu={moreMenu}
								icon={<Icon lucideId="more-vertical" />}
								onOpen={onMoreMenuOpen}
							/>
						</Stack>
					</Stack>
				</Padding>
			</div>
			<MoreMenu
				id={moreMenu.id}
				isOpen={isMoreMenuOpen}
				triggerPosition={moreMenuTriggerPosition}
				numFrozenColumns={numFrozenColumns}
				onFrozenColumnsChange={onFrozenColumnsChange}
				onFilterClick={() => onFilterMenuOpen()}
				onToggleColumnClick={() => onToggleMenuOpen()}
				onRequestClose={onMoreMenuRequestClose}
				onClose={onMoreMenuClose}
			/>
			<ToggleColumnMenu
				id={toggleMenu.id}
				isOpen={isToggleMenuOpen}
				triggerPosition={
					isSmallScreen
						? moreMenuTriggerPosition
						: toggleMenuTriggerPosition
				}
				columns={columnsWithMarkdown}
				onToggle={onColumnToggle}
				onRequestClose={onToggleMenuRequestClose}
				onClose={onToggleMenuClose}
			/>
			<FilterMenu
				id={filterMenu.id}
				isOpen={isFilterMenuOpen}
				triggerPosition={
					isSmallScreen
						? moreMenuTriggerPosition
						: filterMenuTriggerPosition
				}
				columns={filterableColumns}
				filterRules={filterRules}
				onTextChange={onRuleTextChange}
				onColumnChange={onRuleColumnChange}
				onFilterTypeChange={onRuleFilterTypeChange}
				onDeleteClick={onRuleDeleteClick}
				onTagsChange={onRuleTagsChange}
				onAddClick={onRuleAddClick}
				onToggle={onRuleToggle}
				onRequestClose={onFilterMenuRequestClose}
				onClose={onFilterMenuClose}
			/>
		</>
	);
}
