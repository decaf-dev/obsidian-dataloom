import { useOverflowClassname } from "src/services/spacing/hooks";

import "./styles.css";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
}

export default function NumberCell({
	value,
	shouldWrapOverflow,
	useAutoWidth,
}: Props) {
	const overflowClassName = useOverflowClassname(
		useAutoWidth,
		shouldWrapOverflow
	);
	const className = "NLT__number-cell" + " " + overflowClassName;

	return <div className={className}>{value}</div>;
}
