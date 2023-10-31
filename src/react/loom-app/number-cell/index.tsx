import { isNumber } from "src/shared/match";
import {
	CurrencyType,
	NumberFormat,
} from "src/shared/loom-state/types/loom-state";
import { getNumberCellContent } from "src/shared/cell-content/number-cell-content";
import "./styles.css";

interface Props {
	value: string;
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
	if (isNumber(value)) {
		value = getNumberCellContent(format, value, {
			currency,
			prefix,
			suffix,
			separator,
		});
	}

	return <div className="dataloom-number-cell">{value}</div>;
}
