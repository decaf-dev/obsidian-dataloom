import Button from "src/components/Button";
import ToggleColumnMenu from "./components/ToggleColumnMenu";
import { isMenuOpen, openMenu } from "src/services/menu/menuSlice";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import Icon from "src/components/Icon";
import { IconType } from "src/services/icon/types";
import { ToggleColumn } from "./types";

interface Props {
	onToggle: (id: string) => void;
	columns: ToggleColumn[];
}

export default function ToggleColumn({ columns, onToggle }: Props) {
	const [menu, menuPosition] = useMenu(MenuLevel.ONE);
	const shouldOpenMenu = useAppSelector((state) =>
		isMenuOpen(state, menu.id)
	);
	const dispatch = useAppDispatch();

	const { top, left, width } = menuPosition.position;
	return (
		<>
			<div className="NLT__toggle-column" ref={menuPosition.containerRef}>
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
				left={left - width - 100}
				isOpen={shouldOpenMenu}
				columns={columns}
				onToggle={onToggle}
			/>
		</>
	);
}
