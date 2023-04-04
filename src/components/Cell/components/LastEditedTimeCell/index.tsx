import { useOverflowClassName } from "src/services/spacing/hooks";
import { dateTimeToString } from "src/services/string/conversion";

interface Props {
	value: number;
	hasAutoWidth: boolean;
	shouldWrapOverflow: boolean;
}

export default function LastEditedTimeCell({
	value,
	hasAutoWidth,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflowClassName(
		hasAutoWidth,
		shouldWrapOverflow
	);
	const className = "NLT__last-edited-time-cell" + " " + overflowClassName;

	return <div className={className}>{dateTimeToString(value)}</div>;
}
