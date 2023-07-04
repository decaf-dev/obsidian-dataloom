import React from "react";

import MenuButton from "src/react/shared/menu-button";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import FilterMenu from "./filter-menu";
import { FilterRule, FilterType } from "src/shared/types";
import { ColumnWithMarkdown } from "../types";
import { usePrevious } from "src/shared/hooks";

interface Props {
	columns: ColumnWithMarkdown[];
	filterRules: FilterRule[];
	onDeleteClick: (id: string) => void;
	onToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onFilterTypeChange: (id: string, value: FilterType) => void;
	onTextChange: (id: string, value: string) => void;
	onAddClick: (columnId: string) => void;
	onTagsChange: (id: string, value: string[]) => void;
}

const areEqual = (prevProps: Readonly<Props>, nextProps: Readonly<Props>) => {
	const columnsMatch =
		JSON.stringify(prevProps.columns) === JSON.stringify(nextProps.columns);
	const filterRulesMatch =
		JSON.stringify(prevProps.filterRules) ===
		JSON.stringify(nextProps.filterRules);

	return columnsMatch && filterRulesMatch;
};

const Filter = ({
	columns,
	filterRules,
	onAddClick,
	onColumnChange,
	onDeleteClick,
	onFilterTypeChange,
	onToggle,
	onTextChange,
	onTagsChange,
}: Props) => {
	const { menu, menuRef, isMenuOpen } = useMenu(MenuLevel.ONE);
	const { triggerRef, triggerPosition } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		openDirection: "left",
	});

	const previousLength = usePrevious(filterRules.length);
	React.useEffect(() => {
		if (previousLength !== undefined) {
			if (previousLength < filterRules.length) {
				if (menuRef.current) {
					//Scroll to the bottom if we're adding a new rule
					menuRef.current.scrollTop = menuRef.current.scrollHeight;
				}
			}
		}
	}, [previousLength, filterRules.length, menuRef]);

	return (
		<>
			<div ref={triggerRef}>
				<MenuButton isLink menu={menu}>
					Filter
				</MenuButton>
			</div>
			<FilterMenu
				id={menu.id}
				ref={menuRef}
				top={triggerPosition.top}
				left={triggerPosition.left}
				isOpen={isMenuOpen}
				columns={columns}
				filterRules={filterRules}
				onTextChange={onTextChange}
				onColumnChange={onColumnChange}
				onFilterTypeChange={onFilterTypeChange}
				onDeleteClick={onDeleteClick}
				onAddClick={onAddClick}
				onToggle={onToggle}
				onTagsChange={onTagsChange}
			/>
		</>
	);
};

export default React.memo(Filter, areEqual);
