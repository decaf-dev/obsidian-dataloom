import { unixTimeToDateTimeString } from "src/shared/date/date-conversion";
import { DateFormat } from "src/shared/loom-state/types/loom-state";

interface Props {
	value: number;
	format: DateFormat;
}

export default function LastEditedTimeCell({ value, format }: Props) {
	return (
		<div className="dataloom-last-edited-time-cell">
			{unixTimeToDateTimeString(value, format)}
		</div>
	);
}
