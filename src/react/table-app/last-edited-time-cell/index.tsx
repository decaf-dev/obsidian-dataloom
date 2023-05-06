import { unixTimeToDateTimeString } from "src/shared/date/date-conversion";
import { useOverflowClassName } from "src/shared/spacing/hooks";
import { DateFormat } from "src/data/types";

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

	return (
		<div className={className}>
			{unixTimeToDateTimeString(value, format)}
		</div>
	);
}
