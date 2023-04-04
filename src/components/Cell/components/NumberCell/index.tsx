import { useOverflowClassname } from "src/services/spacing/hooks";

import "./styles.css";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
	hasAutoWidth: boolean;
}

export default function NumberCell({
	value,
	shouldWrapOverflow,
	hasAutoWidth,
}: Props) {
	const overflowClassName = useOverflowClassname(
		hasAutoWidth,
		shouldWrapOverflow
	);
	const className = "NLT__number-cell" + " " + overflowClassName;

	return <div className={className}>{value}</div>;
}
