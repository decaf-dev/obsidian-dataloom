import { dateTimeToDateString } from "src/shared/date/date-time-conversion";
import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";

interface Props {
	value: string;
	format: DateFormat;
	formatSeparator: DateFormatSeparator;
	hour12: boolean;
}

export default function LastEditedTimeCell({
	value,
	format,
	formatSeparator,
	hour12,
}: Props) {
	return (
		<div className="dataloom-last-edited-time-cell">
			{dateTimeToDateString(value, format, formatSeparator, {
				includeTime: true,
				hour12,
			})}
		</div>
	);
}
