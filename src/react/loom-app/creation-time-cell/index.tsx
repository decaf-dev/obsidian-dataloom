import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import { dateTimeToDateString } from "src/shared/date/date-time-conversion";

interface Props {
	value: string;
	format: DateFormat;
	formatSeparator: DateFormatSeparator;
	hour12: boolean;
}

export default function CreationTimeCell({
	value,
	format,
	formatSeparator,
	hour12,
}: Props) {
	return (
		<div className="dataloom-creation-time-cell">
			{dateTimeToDateString(value, format, formatSeparator, {
				includeTime: true,
				hour12,
			})}
		</div>
	);
}
