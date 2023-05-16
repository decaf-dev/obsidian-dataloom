import { useOverflowClassName } from "src/shared/spacing/hooks";

import "./styles.css";
import { isNumber } from "src/shared/validators";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
}

export default function NumberCell({ value, shouldWrapOverflow }: Props) {
	const overflowClassName = useOverflowClassName(shouldWrapOverflow);
	const className = "NLT__number-cell" + " " + overflowClassName;

	let valueString = "";
	if (isNumber(value)) valueString = value;

	return <div className={className}>{valueString}</div>;
}
