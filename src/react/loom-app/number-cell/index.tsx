import { useOverflow } from "src/shared/spacing/hooks";

import { isNumber } from "src/shared/match";
import "./styles.css";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
}

export default function NumberCell({ value, shouldWrapOverflow }: Props) {
	const overflowClassName = useOverflow(shouldWrapOverflow);

	let valueString = "";
	if (isNumber(value)) valueString = value;

	let className = "dataloom-number-cell";
	className += " " + overflowClassName;

	return <div className={overflowClassName}>{valueString}</div>;
}
