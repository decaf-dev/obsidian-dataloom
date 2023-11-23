import {
	CurrencyType,
	NumberFormat,
} from "src/shared/loom-state/types/loom-state";
import { getNumberCellContent } from "src/shared/cell-content/number-cell-content";
import "./styles.css";

interface Props {
	value: number | null;
	currency: CurrencyType;
	format: NumberFormat;
	prefix: string;
	suffix: string;
	separator: string;
}

export default function NumberCell({
	value,
	currency,
	format,
	prefix,
	suffix,
	separator,
}: Props) {
	let formattedValue = "";
	if (value !== null) {
		formattedValue = getNumberCellContent(format, value, {
			currency,
			prefix,
			suffix,
			separator,
		});
	}

	return <div className="dataloom-number-cell">{formattedValue}</div>;
}
