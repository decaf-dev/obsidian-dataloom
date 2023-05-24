import { MenuButton } from "src/react/shared/button";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";
import FilterMenu from "./filter-menu";
import { FilterRule } from "src/shared/types/types";
import { ColumnWithMarkdown } from "../types";

interface Props {
	columns: ColumnWithMarkdown[];
	filterRules: FilterRule[];
	onDeleteClick: (id: string) => void;
	onToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onFilterTypeChange: (id: string, value: string) => void;
	onTextChange: (id: string, value: string) => void;
	onAddClick: (columnId: string) => void;
	onTagsChange: (id: string, value: string[]) => void;
}

export default function Filter({
	columns,
	filterRules,
	onAddClick,
	onColumnChange,
	onDeleteClick,
	onFilterTypeChange,
	onToggle,
	onTextChange,
	onTagsChange,
}: Props) {
	const { menu, menuPosition, isMenuOpen, openMenu, closeTopMenu } = useMenu(
		MenuLevel.ONE
	);

	function handleClick() {
		if (isMenuOpen) {
			closeTopMenu();
		} else {
			openMenu(menu);
		}
	}

	const {
		position: { top, left },
		isMenuReady,
	} = shiftMenuIntoViewContent({
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
				isReady={isMenuReady}
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
}
