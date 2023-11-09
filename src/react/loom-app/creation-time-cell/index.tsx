import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import { dateTimeToDateString } from "src/shared/date/date-conversion";

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
			{dateTimeToDateString(value, format, formatSeparator, {
				includeTime: true,
			})}
		</div>
	);
}
