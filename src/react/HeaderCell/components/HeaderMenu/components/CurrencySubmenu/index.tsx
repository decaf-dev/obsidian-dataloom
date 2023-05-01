import MenuItem from "src/react/shared/MenuItem";
import Submenu from "../Submenu";
import { CurrencyType } from "src/data/types";
import { getDisplayNameForCurrencyType } from "src/services/tableState/utils";

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
