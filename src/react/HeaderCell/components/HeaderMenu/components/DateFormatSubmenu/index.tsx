import MenuItem from "src/react/shared/MenuItem";
import Submenu from "../Submenu";
import { DateFormat } from "src/data/types";
import { getDisplayNameForDateFormat } from "src/services/tableState/utils";

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
