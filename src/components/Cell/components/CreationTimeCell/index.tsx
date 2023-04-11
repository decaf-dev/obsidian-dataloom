import { unixTimeToString } from "src/services/date";
import { useOverflowClassName } from "src/services/spacing/hooks";
import { DateFormat } from "src/services/tableState/types";

interface Props {
	value: number;
	format: DateFormat;
	shouldWrapOverflow: boolean;
}

export default function CreationTimeCell({
	value,
	format,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflowClassName(shouldWrapOverflow);
	const className = "NLT__creation-time-cell" + " " + overflowClassName;

	return <div className={className}>{unixTimeToString(value, format)}</div>;
}
