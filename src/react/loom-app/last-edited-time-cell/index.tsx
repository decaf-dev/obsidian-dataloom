import { dateTimeToDateTimeString } from "src/shared/date/date-conversion";
import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";

interface Props {
	value: string;
	format: DateFormat;
	formatSeparator: DateFormatSeparator;
}

export default function LastEditedTimeCell({
	value,
	format,
	formatSeparator,
}: Props) {
	return (
		<div className="dataloom-last-edited-time-cell">
			{dateTimeToDateTimeString(value, format, formatSeparator)}
		</div>
	);
}
