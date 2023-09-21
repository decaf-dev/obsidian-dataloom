import MenuItem from "src/react/shared/menu-item";
import Submenu from "../../shared/submenu";
import {
	CurrencyType,
	NumberFormat,
} from "src/shared/loom-state/types/loom-state";
import { getDisplayNameForCurrencyType } from "src/shared/loom-state/type-display-names";

interface Props {
	title: string;
	format: NumberFormat;
	currency: CurrencyType;
	onNumberFormatChange: (
		value: NumberFormat,
		options?: {
			currency: CurrencyType;
		}
	) => void;
	onBackClick: () => void;
}

export default function CurrencySubmenu({
	title,
	format,
	currency,
	onNumberFormatChange,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<MenuItem
				name="Number"
				onClick={() => onNumberFormatChange(NumberFormat.NUMBER)}
				isSelected={format === NumberFormat.NUMBER}
			/>
			{Object.values(CurrencyType).map((type) => (
				<MenuItem
					key={type}
					name={getDisplayNameForCurrencyType(type)}
					onClick={() =>
						onNumberFormatChange(NumberFormat.CURRENCY, {
							currency: type,
						})
					}
					isSelected={
						type === currency && format === NumberFormat.CURRENCY
					}
				/>
			))}
		</Submenu>
	);
}
