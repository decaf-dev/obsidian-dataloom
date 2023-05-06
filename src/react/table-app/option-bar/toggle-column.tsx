import { MenuButton } from "src/react/shared/button";
import ToggleColumnMenu from "./toggle-column-menu";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import Icon from "src/react/shared/icon";
import { ToggleColumn } from "./types";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";
import { IconType } from "src/react/shared/icon/types";

interface Props {
	onToggle: (id: string) => void;
	columns: ToggleColumn[];
}

export default function ToggleColumn({ columns, onToggle }: Props) {
	const { menu, menuPosition, isMenuOpen, openMenu } = useMenu(MenuLevel.ONE);

	const { top, left } = shiftMenuIntoViewContent({
		menuId: menu.id,
		menuPositionEl: menuPosition.positionRef.current,
		menuPosition: menuPosition.position,
		leftOffset: -175,
	});
	return (
		<>
			<div className="NLT__toggle-column" ref={menuPosition.positionRef}>
				<MenuButton
					menuId={menu.id}
					icon={<Icon type={IconType.VIEW_COLUMN} />}
					ariaLabel="Toggle column"
					onClick={() => {
						openMenu(menu);
					}}
				/>
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
