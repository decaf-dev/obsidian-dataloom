import { useOverflowClassName } from "src/shared/spacing/hooks";

import "./styles.css";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
}

export default function NumberCell({ value, shouldWrapOverflow }: Props) {
	const overflowClassName = useOverflowClassName(shouldWrapOverflow);
	const className = "NLT__number-cell" + " " + overflowClassName;

	return <div className={className}>{value}</div>;
}
