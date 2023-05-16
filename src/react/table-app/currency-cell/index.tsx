import { useOverflowClassName } from "src/shared/spacing/hooks";

import "./styles.css";
import { CurrencyType } from "src/shared/table-state/types";
import { stringToCurrencyString } from "src/shared/conversion";
import { isNumber } from "src/shared/validators";

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

	let valueString = "";
	if (isNumber(value))
		valueString = stringToCurrencyString(value, currencyType);

	const className = "NLT__currency-cell" + " " + overflowClassName;

	return <div className={className}>{valueString}</div>;
}
