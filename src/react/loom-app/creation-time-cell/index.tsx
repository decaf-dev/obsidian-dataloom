import { useOverflow } from "src/shared/spacing/hooks";
import { DateFormat } from "src/shared/loom-state/types/loom-state";
import { unixTimeToDateTimeString } from "src/shared/date/date-conversion";

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
	const overflowClassName = useOverflow(shouldWrapOverflow);

	let className = "dataloom-creation-time-cell";
	className += " " + overflowClassName;
	return (
		<div className={className}>
			{unixTimeToDateTimeString(value, format)}
		</div>
	);
}
