import MenuItem from "src/react/shared/menu-item";
import Submenu from "../Submenu";
import { CurrencyType } from "src/shared/table-state/types";
import { getDisplayNameForCurrencyType } from "src/shared/table-state/display-name";

interface Props {
	title: string;
	value: CurrencyType;
	onValueClick: (value: CurrencyType) => void;
	onBackClick: () => void;
}

export default function CurrencySubmenu({
	title,
	value,
	onValueClick,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			{Object.values(CurrencyType).map((type) => (
				<MenuItem
					key={type}
					name={getDisplayNameForCurrencyType(type)}
					onClick={() => onValueClick(type)}
					isSelected={type === value}
				/>
			))}
		</Submenu>
	);
}
