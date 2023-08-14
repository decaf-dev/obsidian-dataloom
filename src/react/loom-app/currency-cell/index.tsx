import { useOverflow } from "src/shared/spacing/hooks";

import { CurrencyType } from "src/shared/loom-state/types";
import { getCurrencyCellContent } from "src/shared/cell-content/currency-cell-content";
import "./styles.css";

interface Props {
	value: string;
	currencyType: CurrencyType;
}

export default function CurrencyCell({ value, currencyType }: Props) {
	const content = getCurrencyCellContent(value, currencyType);
	const overflowClassName = useOverflow(false);

	let className = "dataloom-currency-cell";
	className += " " + overflowClassName;

	return <div className={className}>{content}</div>;
}
