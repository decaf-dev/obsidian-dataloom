import Button from "src/react/shared/button";
import ToggleColumnMenu from "./toggle-column-menu";
import { openMenu } from "src/redux/menu/menu-slice";
import { useAppDispatch } from "src/redux/global/hooks";
import { useMenu } from "src/redux/menu/hooks";
import { MenuLevel } from "src/redux/menu/types";
import Icon from "src/react/shared/icon";
import { ToggleColumn } from "./types";
import { shiftMenuIntoViewContent } from "src/redux/menu/utils";
import { IconType } from "src/react/shared/icon/types";

interface Props {
	onToggle: (id: string) => void;
	columns: ToggleColumn[];
}

export default function ToggleColumn({ columns, onToggle }: Props) {
	const { menu, menuPosition, isMenuOpen } = useMenu(MenuLevel.ONE);
	const dispatch = useAppDispatch();

	const { top, left } = shiftMenuIntoViewContent(
		menu.id,
		menuPosition.positionRef.current,
		menuPosition.position,
		0,
		-175
	);
	return (
		<>
			<div className="NLT__toggle-column" ref={menuPosition.positionRef}>
				<Button
					icon={<Icon type={IconType.VIEW_COLUMN} />}
					ariaLabel="Toggle column"
					onClick={() => {
						dispatch(openMenu(menu));
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
