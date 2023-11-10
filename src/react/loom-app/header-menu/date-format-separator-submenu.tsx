import MenuItem from "src/react/shared/menu-item";
import Submenu from "../../shared/submenu";
import { DateFormatSeparator } from "src/shared/loom-state/types/loom-state";
import { getDisplayNameForDateFormatSeparator } from "src/shared/loom-state/type-display-names";

interface Props {
	title: string;
	value: DateFormatSeparator;
	onValueClick: (value: DateFormatSeparator) => void;
	onBackClick: () => void;
}

export default function DateFormatSeparatorSubmenu({
	title,
	value,
	onValueClick,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			{Object.values(DateFormatSeparator).map((format) => (
				<MenuItem
					key={format}
					name={getDisplayNameForDateFormatSeparator(format)}
					onClick={() => onValueClick(format)}
					isSelected={format === value}
				/>
			))}
		</Submenu>
	);
}
