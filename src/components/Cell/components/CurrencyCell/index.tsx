import { useOverflowClassName } from "src/services/spacing/hooks";

import "./styles.css";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
	hasAutoWidth: boolean;
}

export default function CurrencyCell({
	value,
	shouldWrapOverflow,
	hasAutoWidth,
}: Props) {
	const overflowClassName = useOverflowClassName(
		hasAutoWidth,
		shouldWrapOverflow
	);
	const className = "NLT__currency-cell" + " " + overflowClassName;
	const valueFormatted = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(parseFloat(value));

	return <div className={className}>{valueFormatted}</div>;
}
