import Button from "src/components/Button";
import ToggleColumnMenu from "./components/ToggleColumnMenu";
import { openMenu } from "src/services/menu/menuSlice";
import { useAppDispatch } from "src/services/redux/hooks";
import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import Icon from "src/components/Icon";
import { IconType } from "src/services/icon/types";
import { ToggleColumn } from "./types";
import { shiftMenuIntoViewContent } from "src/services/menu/utils";

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
