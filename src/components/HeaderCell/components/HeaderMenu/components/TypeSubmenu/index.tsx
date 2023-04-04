import MenuItem from "src/components/MenuItem";
import Submenu from "../Submenu";
import { CellType } from "src/services/tableState/types";
import { getDisplayNameForCellType } from "src/services/tableState/utils";
import { getIconTypeFromCellType } from "src/services/icon/utils";
interface Props {
	title: string;
	columnType: string;
	onTypeClick: (value: CellType) => void;
	onBackClick: () => void;
}

export default function TypeSubmenu({
	title,
	columnType,
	onTypeClick,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			{Object.values(CellType).map((type: CellType) => (
				<MenuItem
					key={type}
					name={getDisplayNameForCellType(type)}
					iconType={getIconTypeFromCellType(type)}
					onClick={() => onTypeClick(type)}
					isSelected={type === columnType}
				/>
			))}
		</Submenu>
	);
}
