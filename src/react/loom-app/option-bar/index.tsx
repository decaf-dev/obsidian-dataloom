import React from "react";

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
import { MenuLevel } from "src/shared/menu/types";
import { useMenu } from "src/shared/menu/hooks";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { isSmallScreenSize } from "src/shared/render/utils";
import { useMenuState } from "../menu-provider";
import { usePrevious } from "src/shared/hooks";

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

	const { replaceMenu } = useMenuState();
	const {
		menu: moreMenu,
		isMenuOpen: isMoreMenuOpen,
		menuRef: moreMenuRef,
		closeTopMenu,
	} = useMenu(MenuLevel.ONE);
	const {
		triggerRef: moreMenuTriggerRef,
		triggerPosition: moreMenuTriggerPosition,
	} = useMenuTriggerPosition();

	const {
		menu: toggleColumnMenu,
		isMenuOpen: isToggleColumnMenuOpen,
		menuRef: toggleColumnMenuRef,
	} = useMenu(MenuLevel.ONE);
	const {
		triggerRef: toggleColumnMenuTriggerRef,
		triggerPosition: toggleMenuTriggerPosition,
	} = useMenuTriggerPosition();

	const {
		menu: filterMenu,
		isMenuOpen: isFilterMenuOpen,
		menuRef: filterMenuRef,
	} = useMenu(MenuLevel.ONE);

	const {
		triggerRef: filterMenuTriggerRef,
		triggerPosition: filterMenuTriggerPosition,
	} = useMenuTriggerPosition();

	useShiftMenu(moreMenuTriggerRef, moreMenuRef, isMoreMenuOpen, {
		openDirection: "left",
	});
	useShiftMenu(filterMenuTriggerRef, filterMenuRef, isFilterMenuOpen, {
		openDirection: "left",
	});
	useShiftMenu(
		toggleColumnMenuTriggerRef,
		toggleColumnMenuRef,
		isToggleColumnMenuOpen,
		{
			openDirection: "left",
		}
	);

	const previousLength = usePrevious(filterRules.length);
	React.useEffect(() => {
		if (previousLength !== undefined) {
			if (previousLength < filterRules.length) {
				if (filterMenuRef.current) {
					//Scroll to the bottom if we're adding a new rule
					filterMenuRef.current.scrollTop =
						filterMenuRef.current.scrollHeight;
				}
			}
		}
	}, [previousLength, filterRules.length, filterMenuRef]);

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
								<div ref={filterMenuTriggerRef}>
									<MenuButton menu={filterMenu}>
										Filter
									</MenuButton>
								</div>
							)}
							{isSmallScreen === false && (
								<div ref={toggleColumnMenuTriggerRef}>
									<MenuButton menu={toggleColumnMenu}>
										Toggle
									</MenuButton>
								</div>
							)}
							<div ref={moreMenuTriggerRef}>
								<MenuButton
									menu={moreMenu}
									icon={<Icon lucideId="more-vertical" />}
								/>
							</div>
						</Stack>
					</Stack>
				</Padding>
			</div>
			<MoreMenu
				id={moreMenu.id}
				ref={moreMenuRef}
				isOpen={isMoreMenuOpen}
				top={moreMenuTriggerPosition.top}
				left={moreMenuTriggerPosition.left}
				numFrozenColumns={numFrozenColumns}
				onFrozenColumnsChange={onFrozenColumnsChange}
				onCloseClick={handleMenuCloseClick}
				onFilterClick={() => replaceMenu(filterMenu)}
				onToggleColumnClick={() => replaceMenu(toggleColumnMenu)}
			/>
			<ToggleColumnMenu
				id={toggleColumnMenu.id}
				ref={toggleColumnMenuRef}
				top={
					isSmallScreen
						? moreMenuTriggerPosition.top
						: toggleMenuTriggerPosition.top
				}
				left={
					isSmallScreen
						? moreMenuTriggerPosition.left
						: toggleMenuTriggerPosition.left
				}
				isOpen={isToggleColumnMenuOpen}
				columns={columnsWithMarkdown}
				onToggle={onColumnToggle}
			/>
			<FilterMenu
				id={filterMenu.id}
				ref={filterMenuRef}
				top={
					isSmallScreen
						? moreMenuTriggerPosition.top
						: filterMenuTriggerPosition.top
				}
				left={
					isSmallScreen
						? moreMenuTriggerPosition.left
						: filterMenuTriggerPosition.left
				}
				isOpen={isFilterMenuOpen}
				columns={filterableColumns}
				filterRules={filterRules}
				onTextChange={onRuleTextChange}
				onColumnChange={onRuleColumnChange}
				onFilterTypeChange={onRuleFilterTypeChange}
				onDeleteClick={onRuleDeleteClick}
				onTagsChange={onRuleTagsChange}
				onAddClick={onRuleAddClick}
				onToggle={onRuleToggle}
			/>
		</>
	);
}
