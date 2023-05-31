import { useOverflow } from "src/shared/spacing/hooks";

import { CurrencyType } from "src/shared/types/types";
import { stringToCurrencyString } from "src/shared/conversion";
import { isNumber } from "src/shared/validators";

import "./styles.css";

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
	let valueString = "";
	if (isNumber(value))
		valueString = stringToCurrencyString(value, currencyType);

	const overflowStyle = useOverflow(shouldWrapOverflow);

	return (
		<div className="NLT__currency-cell" css={overflowStyle}>
			{valueString}
		</div>
	);
}
