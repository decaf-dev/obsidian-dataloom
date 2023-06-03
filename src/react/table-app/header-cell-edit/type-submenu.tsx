import MenuItem from "src/react/shared/menu-item";
import Submenu from "./submenu";
import { CellType } from "src/shared/types/types";
import { getDisplayNameForCellType } from "src/shared/table-state/display-name";
import { getIconIdForCellType } from "src/react/shared/icon/utils";
interface Props {
	title: string;
	value: CellType;
	onValueClick: (value: CellType) => void;
	onBackClick: () => void;
}

export default function TypeSubmenu({
	title,
	value,
	onValueClick,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			{Object.values(CellType).map((type: CellType) => (
				<MenuItem
					key={type}
					name={getDisplayNameForCellType(type)}
					lucideId={getIconIdForCellType(type)}
					onClick={() => onValueClick(type)}
					isSelected={type === value}
				/>
			))}
		</Submenu>
	);
}
