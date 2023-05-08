import { MenuButton } from "src/react/shared/button";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";
import FilterMenu from "./filter-menu";
import { ColumnData } from "../types";
import { FilterRule } from "src/data/types";

interface Props {
	columns: ColumnData[];
	filterRules: FilterRule[];
	onDeleteClick: (id: string) => void;
	onToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onFilterTypeChange: (id: string, value: string) => void;
	onValueChange: (id: string, value: string) => void;
	onAddClick: () => void;
}

export default function Filter({
	columns,
	filterRules,
	onAddClick,
	onColumnChange,
	onDeleteClick,
	onFilterTypeChange,
	onToggle,
	onValueChange,
}: Props) {
	const {
		menu,
		menuPosition,
		isMenuOpen,
		openMenu,
		closeTopMenuAndFocusTrigger,
	} = useMenu(MenuLevel.ONE);

	function handleClick() {
		if (isMenuOpen) {
			closeTopMenuAndFocusTrigger();
		} else {
			openMenu(menu);
		}
	}

	const { top, left } = shiftMenuIntoViewContent({
		menuId: menu.id,
		menuPositionEl: menuPosition.positionRef.current,
		menuPosition: menuPosition.position,
		leftOffset: -575,
	});
	return (
		<>
			<div ref={menuPosition.positionRef}>
				<MenuButton
					isLink
					menuId={menu.id}
					onClick={() => handleClick()}
				>
					Filter
				</MenuButton>
			</div>
			<FilterMenu
				id={menu.id}
				top={top}
				left={left}
				isOpen={isMenuOpen}
				columns={columns}
				onValueChange={onValueChange}
				onColumnChange={onColumnChange}
				onFilterTypeChange={onFilterTypeChange}
				onDeleteClick={onDeleteClick}
				onAddClick={onAddClick}
				onToggle={onToggle}
				filterRules={filterRules}
			/>
		</>
	);
}
