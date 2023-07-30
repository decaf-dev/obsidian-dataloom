import { useOverflow } from "src/shared/spacing/hooks";

import { CurrencyType } from "src/shared/types";
import { getCurrencyCellContent } from "src/shared/cell-content/currency-cell-content";
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
	const content = getCurrencyCellContent(value, currencyType);
	const overflowStyle = useOverflow(shouldWrapOverflow);

	return (
		<div className="dataloom-currency-cell" css={overflowStyle}>
			{content}
		</div>
	);
}
