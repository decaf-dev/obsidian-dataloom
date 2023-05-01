import { useOverflowClassName } from "src/services/spacing/hooks";

import "./styles.css";
import { CurrencyType } from "src/data/types";
import { stringToCurrencyString } from "src/services/string/conversion";

interface Props {
	value: string;
	currencyType: CurrencyType;
	shouldWrapOverflow: boolean;
}

export default function CurrencyCell({
	value,
	currencyType,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflowClassName(shouldWrapOverflow);

	let valueFormatted = "";
	if (value !== "") {
		valueFormatted = stringToCurrencyString(value, currencyType);
	}

	const className = "NLT__currency-cell" + " " + overflowClassName;

	return <div className={className}>{valueFormatted}</div>;
}
