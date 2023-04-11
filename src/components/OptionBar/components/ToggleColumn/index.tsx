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
	const menu = useMenu(MenuLevel.ONE);
	const isOpen = useAppSelector((state) => isMenuOpen(state, menu.id));
	const dispatch = useAppDispatch();

	const { top, left, width } = menu.position;
	return (
		<>
			<div className="NLT__toggle-column" ref={menu.containerRef}>
				<Button
					icon={<Icon type={IconType.VIEW_COLUMN} />}
					onClick={() => {
						dispatch(
							openMenu({
								id: menu.id,
								level: menu.level,
							})
						);
					}}
				/>
			</div>
			<ToggleColumnMenu
				id={menu.id}
				top={top}
				left={left - width - 100}
				isOpen={isOpen}
				columns={columns}
				onToggle={onToggle}
			/>
		</>
	);
}
