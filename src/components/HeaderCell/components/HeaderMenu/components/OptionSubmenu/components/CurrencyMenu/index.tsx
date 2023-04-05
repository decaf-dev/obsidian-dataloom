import Menu from "src/components/Menu";
import MenuItem from "src/components/MenuItem";
import { CurrencyType } from "src/services/tableState/types";
import { getDisplayNameForCurrencyType } from "src/services/tableState/utils";

interface Props {
	id: string;
	top: number;
	left: number;
	isOpen: boolean;
	value: CurrencyType;
	onCurrencyChange: (value: CurrencyType) => void;
}

export default function CurrencyMenu({
	id,
	top,
	left,
	isOpen,
	value,
	onCurrencyChange,
}: Props) {
	return (
		<Menu isOpen={isOpen} id={id} top={top} left={left} width={175}>
			<div className="NLT__currency-menu">
				{Object.values(CurrencyType).map((type) => (
					<MenuItem
						key={type}
						name={getDisplayNameForCurrencyType(type)}
						isSelected={value === type}
						onClick={() => onCurrencyChange(type)}
					/>
				))}
			</div>
		</Menu>
	);
}
