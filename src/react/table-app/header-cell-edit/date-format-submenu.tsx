import MenuItem from "src/react/shared/menu-item";
import Submenu from "./submenu";
import { DateFormat } from "src/shared/types";
import { getDisplayNameForDateFormat } from "src/shared/dashboard-state/display-name";

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
