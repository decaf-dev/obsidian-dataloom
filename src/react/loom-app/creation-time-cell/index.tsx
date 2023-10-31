import { DateFormat } from "src/shared/loom-state/types/loom-state";
import { unixTimeToDateTimeString } from "src/shared/date/date-conversion";

interface Props {
	value: number;
	format: DateFormat;
}

export default function CreationTimeCell({ value, format }: Props) {
	return (
		<div className="dataloom-creation-time-cell">
			{unixTimeToDateTimeString(value, format)}
		</div>
	);
}
