import { CellType } from "src/services/tableState/types";

import { TYPE_ITEMS } from "../../constants";
import MenuItem from "../MenuItem";
import Submenu from "../Submenu";
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
					icon={null}
					content={item.content}
					onClick={() => onTypeClick(item.type)}
					selected={item.type === columnType}
				/>
			))}
		</Submenu>
	);
}
