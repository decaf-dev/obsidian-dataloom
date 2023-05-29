import ToggleColumnMenu from "./toggle-column-menu";

import { MenuButton } from "src/react/shared/button";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { ColumnWithMarkdown } from "./types";

interface Props {
	columns: ColumnWithMarkdown[];
	onToggle: (id: string) => void;
}

export default function ToggleColumn({ columns, onToggle }: Props) {
	const { menu, isMenuOpen, menuRef, openMenu, closeTopMenu } = useMenu(
		MenuLevel.ONE
	);
	const { triggerPosition, triggerRef } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		openDirection: "left",
	});

	function handleClick() {
		if (isMenuOpen) {
			closeTopMenu();
		} else {
			openMenu(menu);
		}
	}
	return (
		<>
			<div ref={triggerRef}>
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
				ref={menuRef}
				top={triggerPosition.top}
				left={triggerPosition.left}
				isOpen={isMenuOpen}
				columns={columns}
				onToggle={onToggle}
			/>
		</>
	);
}
