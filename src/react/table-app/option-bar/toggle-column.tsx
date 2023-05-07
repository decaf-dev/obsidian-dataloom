import { MenuButton } from "src/react/shared/button";
import ToggleColumnMenu from "./toggle-column-menu";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { ToggleColumn } from "./types";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";

interface Props {
	onToggle: (id: string) => void;
	columns: ToggleColumn[];
}

export default function ToggleColumn({ columns, onToggle }: Props) {
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
		leftOffset: -175,
	});
	return (
		<>
			<div ref={menuPosition.positionRef}>
				<MenuButton
					isLink
					menuId={menu.id}
					onClick={() => handleClick()}
				>
					Toggle
				</MenuButton>
			</div>
			<ToggleColumnMenu
				id={menu.id}
				top={top}
				left={left}
				isOpen={isMenuOpen}
				columns={columns}
				onToggle={onToggle}
			/>
		</>
	);
}
