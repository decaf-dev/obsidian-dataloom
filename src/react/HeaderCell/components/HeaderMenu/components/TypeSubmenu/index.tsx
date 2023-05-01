import MenuItem from "src/react/shared/MenuItem";
import Submenu from "../Submenu";
import { CellType } from "src/data/types";
import { getDisplayNameForCellType } from "src/services/tableState/utils";
import { getIconTypeFromCellType } from "src/services/icon/utils";
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
					iconType={getIconTypeFromCellType(type)}
					onClick={() => onValueClick(type)}
					isSelected={type === value}
				/>
			))}
		</Submenu>
	);
}
