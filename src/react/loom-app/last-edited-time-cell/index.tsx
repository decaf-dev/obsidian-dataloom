import { unixTimeToDateTimeString } from "src/shared/date/date-conversion";
import { useOverflow } from "src/shared/spacing/hooks";
import { DateFormat } from "src/shared/loom-state/types/loom-state";

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
	const overflowClassName = useOverflow(shouldWrapOverflow);

	let className = "dataloom-last-edited-time-cell";
	className += " " + overflowClassName;
	return (
		<div className={className}>
			{unixTimeToDateTimeString(value, format)}
		</div>
	);
}
