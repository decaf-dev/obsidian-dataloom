import MenuItem from "src/react/shared/menu-item";
import Submenu from "../../shared/submenu";
import { SortDir } from "src/shared/loom-state/types/loom-state";

interface Props {
	title: string;
	value: SortDir;
	onValueClick: (value: SortDir) => void;
	onBackClick: () => void;
}

export default function ContentsSortDirSubmenu({
	title,
	value,
	onValueClick,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<MenuItem
					key={SortDir.ASC}
					name="Ascending"
					onClick={() => onValueClick(SortDir.ASC)}
					isSelected={value === SortDir.ASC}
				/>
			<MenuItem
					key={SortDir.DESC}
					name="Descending"
					onClick={() => onValueClick(SortDir.DESC)}
					isSelected={value === SortDir.DESC}
				/>
			<MenuItem
					key={SortDir.NONE}
					name="Default"
					onClick={() => onValueClick(SortDir.NONE)}
					isSelected={value === SortDir.NONE}
				/>
		</Submenu>
	);
}
