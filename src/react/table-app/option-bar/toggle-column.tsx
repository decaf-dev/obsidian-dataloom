import ToggleColumnMenu from "./toggle-column-menu";

import { MenuButton } from "src/react/shared/button";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";
import { ColumnWithMarkdown } from "./types";

interface Props {
	columns: ColumnWithMarkdown[];
	onToggle: (id: string) => void;
}

export default function ToggleColumn({ columns, onToggle }: Props) {
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
				isReady={isMenuReady}
				isOpen={isMenuOpen}
				columns={columns}
				onToggle={onToggle}
			/>
		</>
	);
}
