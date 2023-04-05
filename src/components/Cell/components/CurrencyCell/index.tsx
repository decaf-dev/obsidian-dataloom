import { useOverflowClassName } from "src/services/spacing/hooks";

import "./styles.css";
import { CurrencyType } from "src/services/tableState/types";
import { stringToCurrencyString } from "src/services/string/conversion";

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

	const valueFormatted = stringToCurrencyString(value, currencyType);

	const className = "NLT__currency-cell" + " " + overflowClassName;

	return <div className={className}>{valueFormatted}</div>;
}
