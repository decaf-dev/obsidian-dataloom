import { useOverflow } from "src/shared/spacing/hooks";

import { isNumber } from "src/shared/match";
import "./styles.css";

interface Props {
	value: string;
}

export default function NumberCell({ value }: Props) {
	const overflowClassName = useOverflow(false);

	let valueString = "";
	if (isNumber(value)) valueString = value;

	let className = "dataloom-number-cell";
	className += " " + overflowClassName;

	return <div className={overflowClassName}>{valueString}</div>;
}
