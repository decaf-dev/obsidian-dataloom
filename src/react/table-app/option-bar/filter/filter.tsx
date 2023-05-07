import { MenuButton } from "src/react/shared/button";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";
import FilterMenu from "./filter-menu";
import { ToggleColumn } from "../types";

interface Props {
	columns: ToggleColumn[];
}

export default function Filter({ columns }: Props) {
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
			/>
		</>
	);
}
