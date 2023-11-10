import MenuItem from "src/react/shared/menu-item";
import Submenu from "../../shared/submenu";
import { DateFormat } from "src/shared/loom-state/types/loom-state";
import { getDisplayNameForDateFormat } from "src/shared/loom-state/type-display-names";

interface Props {
	title: string;
	value: DateFormat;
	onValueClick: (value: DateFormat) => void;
	onBackClick: () => void;
}

export default function DateFormatSubmenu({
	title,
	value,
	onValueClick,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			{Object.values(DateFormat).map((format) => (
				<MenuItem
					key={format}
					name={getDisplayNameForDateFormat(format)}
					onClick={() => onValueClick(format)}
					isSelected={format === value}
				/>
			))}
		</Submenu>
	);
}
