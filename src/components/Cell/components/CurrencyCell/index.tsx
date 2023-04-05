import { useOverflowClassName } from "src/services/spacing/hooks";

import "./styles.css";
import { CurrencyType } from "src/services/tableState/types";

interface Props {
	value: string;
	currencyType: CurrencyType;
	shouldWrapOverflow: boolean;
	hasAutoWidth: boolean;
}

export default function CurrencyCell({
	value,
	currencyType,
	shouldWrapOverflow,
	hasAutoWidth,
}: Props) {
	const overflowClassName = useOverflowClassName(
		hasAutoWidth,
		shouldWrapOverflow
	);

	const valueFormatted = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currencyType,
	}).format(parseFloat(value));

	const className = "NLT__currency-cell" + " " + overflowClassName;

	return <div className={className}>{valueFormatted}</div>;
}
