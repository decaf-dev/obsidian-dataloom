import { TYPE_ITEMS } from "../../constants";
import MenuItem from "src/components/MenuItem";
import Submenu from "../Submenu";
import { CellType } from "src/services/tableState/types";
interface Props {
	title: string;
	columnType: string;
	onTypeClick: (type: CellType) => void;
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
			{TYPE_ITEMS.map((item) => (
				<MenuItem
					key={item.name}
					name={item.content}
					onClick={() => onTypeClick(item.type)}
					isSelected={item.type === columnType}
				/>
			))}
		</Submenu>
	);
}
