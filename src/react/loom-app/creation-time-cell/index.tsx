import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import { dateTimeToDateTimeString } from "src/shared/date/date-conversion";

interface Props {
	value: string;
	format: DateFormat;
	formatSeparator: DateFormatSeparator;
}

export default function CreationTimeCell({
	value,
	format,
	formatSeparator,
}: Props) {
	return (
		<div className="dataloom-creation-time-cell">
			{dateTimeToDateTimeString(value, format, formatSeparator)}
		</div>
	);
}
