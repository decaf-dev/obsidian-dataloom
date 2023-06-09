import ToggleColumnMenu from "./toggle-column-menu";

import MenuButton from "src/react/shared/menu-button";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { ColumnWithMarkdown } from "./types";

interface Props {
	columns: ColumnWithMarkdown[];
	onToggle: (id: string) => void;
}

export default function ToggleColumn({ columns, onToggle }: Props) {
	const { menu, isMenuOpen, menuRef } = useMenu(MenuLevel.ONE);
	const { triggerPosition, triggerRef } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		openDirection: "left",
	});

	return (
		<>
			<div ref={triggerRef}>
				<MenuButton isLink menu={menu}>
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
