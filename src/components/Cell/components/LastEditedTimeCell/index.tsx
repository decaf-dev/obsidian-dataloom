import { unixTimeToString } from "src/services/date";
import { useOverflowClassName } from "src/services/spacing/hooks";
import { DateFormat } from "src/services/tableState/types";

interface Props {
	value: number;
	format: DateFormat;
	shouldWrapOverflow: boolean;
}

export default function LastEditedTimeCell({
	value,
	format,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflowClassName(shouldWrapOverflow);
	const className = "NLT__last-edited-time-cell" + " " + overflowClassName;

	return <div className={className}>{unixTimeToString(value, format)}</div>;
}
