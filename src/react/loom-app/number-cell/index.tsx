import { useOverflow } from "src/shared/spacing/hooks";

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
	const overflowClassName = useOverflow(false);

	if (isNumber(value)) {
		value = getNumberCellContent(format, value, {
			currency,
			prefix,
			suffix,
			separator,
		});
	}

	let className = "dataloom-number-cell";
	className += " " + overflowClassName;

	return <div className={className}>{value}</div>;
}
